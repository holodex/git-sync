var test = require('tape')

var sync = require('../')

test('sync this repo', function (t) {
  var job = sync({
    remoteUrl: 'git://github.com/holodex/git-sync',
    localDir: __dirname + '/dir',
    cronTime: '*/5 * * * * *'
  }, function (err, tree) {
    t.error(err)
    t.ok(tree.id())
    job.stop()
    t.end()
  })
})
