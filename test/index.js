var test = require('tape')

var sync = require('../')

test('sync this repo', function (t) {
  var lastSynced = null
  var job = sync({
    remoteUrl: 'git://github.com/holodex/git-sync',
    localDir: __dirname + '/dir',
    cronTime: '*/5 * * * * *'
  }, function (err, commit) {
    t.error(err)

    var commitId = commit.id()
    if (lastSynced == null) {
      t.ok(commitId, 'first sync')
    } else {
      t.notOk(!!commitId.equal(lastSynced), 'next sync is fresh commit')
    }
    lastSynced = commitId
  })

  setTimeout(function () {
    job.stop()
    t.end()
  }, 15*1000)
})
