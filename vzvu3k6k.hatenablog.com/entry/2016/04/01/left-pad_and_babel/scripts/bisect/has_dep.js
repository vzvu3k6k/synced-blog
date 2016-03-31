#!/usr/bin/env node

var pkg = require(require('path').resolve(process.cwd(), 'package.json'));
var reverse = process.argv[2] === 'reverse' ? 1 : 0;
if (pkg && pkg.dependencies && 'left-pad' in pkg.dependencies) {
  console.log('y');
  process.exit(0 ^ reverse);
}
console.log('n');
process.exit(1 ^ reverse);
