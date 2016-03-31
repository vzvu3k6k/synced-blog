#!/bin/bash

root_commit=$(git rev-list --max-parents=0 HEAD)
tag=HEAD

git checkout $root_commit
../has_dep.js
if [ $? != 0 ] ; then
    git checkout -

    # left-padがすでに削除されていたら、left-padが残っているコミットを探す。
    # よく考えたら二分探索は適用できないし、checkout HEAD^というのもおかしいんだけども、
    # 今回はたまたま正しい結果が出たっぽい。
    ../has_dep.js
    if [ $? != 0 ] ; then
        git bisect start HEAD $root_commit
        git bisect run ../has_dep.js
        git checkout HEAD^
    fi

    git bisect start HEAD $root_commit
    git bisect run ../has_dep.js reverse
    tag=bisect/bad
fi

git show $tag -s --format='%h %ai' | \
ruby -ne 's,d=$_.split(" ");puts "#{d} #{`basename $(pwd)`.chomp} #{`git remote get-url origin`.sub(/^.+?:/, "https:").sub(/\.git$/, "/commit/").chomp}#{s}"'
