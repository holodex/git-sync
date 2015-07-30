var Git = require('nodegit')
var Cron = require('cron').CronJob
var defined = require('defined')
var Path = require('path')

module.exports = gitSync

function gitSync (opts, cb) {
  if (!defined(opts)) return null
  var remoteUrl = opts.remoteUrl
  if (remoteUrl == null) { throw new Error('gitSync: remoteUrl option is required.')} 
  var localDir = opts.localDir
  if (localDir == null) { throw new Error('gitSync: localDir option is required.')} 
  var branch = defined(opts.branch, 'master')
  var cronTime = defined(opts.cronTime, '* */15 * * * *')
  var timeZone = opts.timeZone

  function onTick () {
    getRepo(remoteUrl, localDir)
      .then(checkoutBranch(branch))
      .then(callbackOnChange(cb))
      .catch(cb)
      .done()
  }

  onTick()

  return new Cron({
    cronTime: cronTime,
    onTick: onTick,
    start: true,
    timeZone: timeZone
  })
}

function getRepo (remoteUrl, localDir) {
  return Git.Repository.open(localDir)
    .catch(function (repo) {
      return null
    })
    .then(function (repo) {
      if (repo == null) {
        return Git.Clone(remoteUrl, localDir, {})
      }
      return repo
    })
}

function checkoutBranch (branch) {
  return function (repo) {
    return repo.getBranchCommit(branch)
      .then(function (commit) {
        return Git.Checkout.tree(repo, commit)
          .then(function () {
            return commit
          })
      })
  }
}

function callbackOnChange (cb) {
  var lastCommitId = null
  return function (commit) {
    var commitId = commit.id()
    if (commitId !== lastCommitId) {
      lastCommitId = commitId
      cb(null, commit)
    }
  }
}
