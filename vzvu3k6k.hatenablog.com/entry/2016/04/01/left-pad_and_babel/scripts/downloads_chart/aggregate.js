'use strict';

let fs = require('fs');
let pkgs = process.argv.slice(2)
      .map((path) => JSON.parse(fs.readFileSync(path, 'utf-8')));

let months = {}; // { '2015-01': [ `pkg[0] downloads`, `pkg[1] downloads` ... ] }
for (let pkgIndex = 0; pkgIndex < pkgs.length; pkgIndex++) {
  let pkg = pkgs[pkgIndex];
  for (let record of pkg.downloads) {
    let label = record.day.slice(0, 7);
    if (!months[label]) {
      months[label] = Array(pkgs.length).fill(0);
    }
    months[label][pkgIndex] += record.downloads;
  }
}

console.log(Object.keys(months).sort().map((label) => [label, ...months[label]]));
