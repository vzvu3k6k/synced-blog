'use strict';

let cheerio = require('cheerio');
let path = require('path');
let fs = require('fs');
let urlLib = require('url');

let http = require('http');
let https = require('https');
let httpAgent = new http.Agent({ keepAlive: true });
let httpsAgent = new https.Agent({ keepAlive: true });

module.exports = { get: get, getArchive, parsePackagePage };

// GET with cache and wait
function get (url, cb) {
  console.error(`GET ${url}`);
  let cachePath = path.join('./cache', url.replace(/[^A-Za-z0-9]/g, '-'));
  try {
    cb(fs.readFileSync(cachePath));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    let options = urlLib.parse(url);
    Object.assign(options, {
      agent: options.protocol === 'http:' ? httpAgent : httpsAgent
    });
    http.get(options, (res) => {
      let body = '';
      let cacheStream = fs.createWriteStream(cachePath);
      res.on('readable', () => {
        let chunk;
        while ((chunk = res.read()) !== null) {
          cacheStream.write(chunk);
          body += chunk.toString();
        }
      });
      res.on('end', () => {
        cacheStream.end();
        setTimeout(() => { cb(body); }, 1000);
      });
    }).on('error', (err) => {
      console.error(`Failed to get ${url}: ${e.stack}`);
      process.exit(1);
    });
  }
}

function getArchive (url, cb) {
  function dateToTimestamp (date) {
    return [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    ].map((n) => `0${n}`.slice(-4)).join('');
  }

  let options = urlLib.format({
    protocol: 'http',
    host: 'archive.org',
    pathname: '/wayback/available',
    query: {
      timestamp: '20150922113035',
      url: url
    }});
  get(options, (body) => {
    body = JSON.parse(body);

    let timestamp;
    let closest = body.archived_snapshots.closest;
    if (closest && closest.available && closest.status === '200') {
      url = closest.url;
      timestamp = closest.timestamp;
    } else {
      timestamp = dateToTimestamp(new Date());
    }

    get(url, (body) => { cb(body, timestamp, url); });
  });
}

// parse https://npmjs.com/package/{package-name}
function parsePackagePage (body) {
  let $ = cheerio.load(body);
  let $dependents = $('.list-of-links.dependents > a');
  let monthlyDownloads = $('.monthly-downloads').text() || '0';
  let lastPublisher = $('.last-publisher a > span').text();
  let node = { monthlyDownloads, lastPublisher };
  let dependents = [];
  if ($dependents.length > 11) {
    let num = '10+';

    // 最近のnpmjs.comではマッチしなくなった
    // https://github.com/npm/newww/commit/5627b71e801ef656719e654a7b14e9ae56f1c915
    let label = $('.list-of-links.dependents > a:last-child').text();
    let match = label.match(/and (\d+) more/);
    if (match) {
      num = $dependents.length - 1 + parseInt(match[1], 10);
    }
    dependents = new Error(`${num} packages`);
  } else {
    $dependents.each(function () {
      let dependent = $(this).text();
      dependents.push(dependent);
    });
  }
  return { node, dependents };
}
