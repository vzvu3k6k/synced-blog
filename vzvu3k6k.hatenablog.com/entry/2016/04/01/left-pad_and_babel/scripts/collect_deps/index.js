'use strict';

let urlLib = require('url');
let lib = require('./lib');

let useWaybackMachine = true;

function processQueue (process, queue, nodes, links, visitedPkg) {
  let task = queue.shift();
  if (!task) {
    console.error('finish');
    console.log(JSON.stringify({
      nodeInfo: nodes,
      nodes: links
    }, null, '  '));
    return;
  }

  console.error(`depth: ${task.depth}, package: ${task.package}, queue.length: ${queue.length}`);

  function next () {
    processQueue(process, queue, nodes, links, visitedPkg);
  }

  if (visitedPkg.indexOf(task.package) !== -1) {
    console.error(`Skip ${task.package} (visited)`);
    next();
  } else {
    visitedPkg.push(task.package);
    process(task, (node, dependents, timestamp, url) => {
      node.url = url;
      node.timestamp = timestamp;
      nodes[task.package] = node;
      console.error(`add to queue: ${dependents}`);
      if (dependents instanceof Error) {
        links = links.concat({ from: dependents.message, to: task.package });
        console.error(`${task.package} has more than 10 dependents. Skip.`);
      } else {
        links = links.concat(dependents.map((pkg) => {
          return { from: pkg, to: task.package };
        }));
        queue = queue.concat(dependents.map((pkg) => {
          return { package: pkg, depth: task.depth + 1 };
        }));
      }
      next();
    });
  }
}

function process (task, cb) {
  let url = `https://www.npmjs.com/package/${task.package}`;

  let _get = lib.get;
  if (useWaybackMachine) {
    _get = lib.getArchive;
  }

  _get(url, (body, timestamp, _url) => {
    let result = lib.parsePackagePage(body);
    cb(result.node, result.dependents, timestamp || null, _url || url);
  });
}

processQueue(process, [{ depth: 0, package: 'left-pad' }], {}, [], []);
