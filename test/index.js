var test = require('tape')

var sync = require('../')

test('sync this repo', function (t) {
  sync({
    remoteUrl: 'git://github.com/holodex/git-sync',
    localDir: __dirname + '/dir',
    cronTime: '* 5 * * * *'
  }, function (commit) {
    console.log(commit)
  })
})
