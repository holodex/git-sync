# git-sync

sync a remote git url to a local dir at a branch

## install

with [npm](https://npmjs.org) installed, run

```
npm install --save git-sync
```

## example

```
var gitSync = require('git-sync')

var cronJob = gitSync({
  remoteUrl: 'https://github.com/holodex/git-sync',
  localDir: __dirname + '/dir',
  branch: 'master',
  cronTime: '* */15 * * * *'
}, function (err, commit) {
  console.log(err, commit.id())
})
```

## api

### `var cronJob = gitSync(options, cb)`

possible `options` are:

- `remoteUrl`: a url to a remote git repository
- `localDir`: a path to a local directory to store the git repository
- `branch`: an optional `String` to specify the name of a git branch
- `cronTime`: any CronTime format supported by [cron](https://www.npmjs.com/package/cron)
- `noCertificateCheck`: a boolean for whether or not to disable HTTPS certificate checking

`cb` is a function that will be called every time there is an error or after the git repository is updated with a new commit. it will be called node-style, with an `Error` (if any) as the first argument and a [NodeGit `Commit`](http://www.nodegit.org/api/commit/) (if any) as the second argument.

`cronJob` returned by `gitSync()` is a [CronJob](https://www.npmjs.com/package/cron) which can be `.stop()` or `.start()`.

## faq

### https

if using an HTTPS url (`https://github.com/holodex/git-sync`) and you receive the following error:

> [Error: The SSL certificate is invalid]

then set the `noCertificateCheck` option to `true`.

### ssh

if using an SSH url (`git@github.com:holodex/git-sync`) and you receive the following error:

> [Error: authentication required but no callback set]

then post in [this issue](https://github.com/holodex/git-sync/issues/2#issuecomment-152686185) as it's not yet implemented. pull requests welcome! :)
