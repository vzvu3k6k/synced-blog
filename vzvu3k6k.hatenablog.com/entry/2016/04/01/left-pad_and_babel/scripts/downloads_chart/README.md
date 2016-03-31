npmのAPIからダウンロード数を取得してGoogle Chart API用に整形する。

```shellsession
$ curl https://api.npmjs.org/downloads/range/2014-10-00:2016-04-01/left-pad > left-pad.json
$ curl https://api.npmjs.org/downloads/range/2014-10-00:2016-04-01/line-numbers > line-numbers.json
$ node aggregate.js left-pad.json line-numbers.json
[ [ '2014-10', 658, 0 ],
  [ '2014-11', 1063, 0 ],
  [ '2014-12', 1542, 37 ],
  [ '2015-01', 2278, 12 ],
  [ '2015-02', 37211, 34859 ],
  [ '2015-03', 182333, 179940 ],
  [ '2015-04', 246109, 260324 ],
  [ '2015-05', 386834, 369633 ],
  [ '2015-06', 533875, 517388 ],
  [ '2015-07', 699099, 694406 ],
  [ '2015-08', 1303893, 1302878 ],
  [ '2015-09', 1407634, 1409982 ],
  [ '2015-10', 1095076, 1096715 ],
  [ '2015-11', 1405125, 1404638 ],
  [ '2015-12', 1652419, 1648995 ],
  [ '2016-01', 1929071, 1926520 ],
  [ '2016-02', 2265293, 2255053 ],
  [ '2016-03', 2091678, 2075484 ] ]
```