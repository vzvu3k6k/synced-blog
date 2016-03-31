dependencyのグラフを作る。graphvizが必要。

```shellsession
$ npm install
$ node index.js | node result_to_dots.js | dot -Tsvg > render.svg
```
