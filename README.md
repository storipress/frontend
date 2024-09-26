# Manager Next

[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/h5qi.svg)](https://betteruptime.com/?utm_source=status_badge)
[![Coverage Status](https://coveralls.io/repos/github/storipress/manager-next/badge.svg?branch=master&t=rgTShI)](https://coveralls.io/github/storipress/manager-next?branch=master)
[![DeepSource](https://deepsource.io/gh/storipress/manager-next.svg/?label=active+issues&show_trend=true&token=lP6Tl0QazSezHHH11krSA5w6)](https://deepsource.io/gh/storipress/manager-next/?ref=repository-badge)

![image](https://user-images.githubusercontent.com/53453555/164131656-b61584af-4744-4586-9bae-e9ba51a8b8c7.png)

## Reminder

1. **If you have problems with `core-component`, ensure your `core-component` version matches the master branch.**
2. **If deploying to production, remember to deploy from a version branch to adhere to TBD best practices**
3. **If a core component does not fit your needs, _extend_ the core component in the [core components repo](https://github.com/storipress/core-component) and open a PR — this way, you can avoid hacky workarounds**

## How to rebase/merge master

### rebase master

1. git fetch
2. git rebase origin/master
3. git push -f (**ONLY IF YOU ARE IN YOUR OWN BRANCH**)

This will rebase your current branch to master. Rebasing will produce a pretty history, but it may produce conflicts.
If you don't know how to solve the conflicts, you can use `git rebase --abort` to abort the rebase and try to use merge instead.

### merge master

1. git fetch
2. git merge origin/master
3. git push

This will merge your current branch to the master. Merging will create a new commit, and it may be easier to resolve any conflicts.
