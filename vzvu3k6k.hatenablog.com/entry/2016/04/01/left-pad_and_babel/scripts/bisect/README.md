```shellsession
$ ./clone.bash # left-padに直接依存していたパッケージのリポジトリを取ってくる
$ cd color2
$ ../bisect.bash # left-padの依存を追加したコミットを探す。バグがあるので注意。
```
