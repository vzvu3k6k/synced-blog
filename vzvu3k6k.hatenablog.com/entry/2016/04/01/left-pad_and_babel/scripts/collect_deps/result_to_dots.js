'use strict';

let fs = require('fs');
let result = JSON.parse(fs.readFileSync(process.argv[2] || '/dev/stdin', 'utf-8'));
console.log(`digraph dependency_tree {
${Object.keys(result.nodeInfo).map((key) => {
  let info = result.nodeInfo[key];
  let label = `${key}\\n${info.monthlyDownloads}/month` + (info.timestamp ? `\\n${info.timestamp.slice(0, 4)}-${info.timestamp.slice(4, 6)}` : '');
  let url = result.nodeInfo[key].url;
  return `"${key}" [label="${label}",URL="${url}"]`;
}).join('\n')}
${result.nodes.map((link) => `"${link.from}" -> "${link.to}"`).join('\n')}
}`);
