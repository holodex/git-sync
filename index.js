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

  function createOnTick () {
    var onChange = callbackOnChange(cb)

    return function () {
      getRepo(remoteUrl, localDir)
        .then(checkoutBranch(branch))
        .then(onChange)
        .catch(cb)
        .done()
    }
  }

  var onTick = createOnTick()

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
    // get local branch
    return repo.getBranch(branch)
      .catch(function (err) {
        // TODO check for specific error
        // create local branch from remote
        return repo.getBranchCommit('origin/' + branch)
          .then(function (commit) {
            return repo.createBranch(
              branch,
              commit,
              true, // force
              repo.defaultSignature(), // signature
              'create ' + branch + ' branch' // log message
            )
          })
      })
      // checkout local branch
      .then(function (branchRef) {
        return repo.checkoutBranch(branchRef, {
          checkoutStrategy: Git.Checkout.STRATEGY.FORCE
        })
      })
      // return latest commit
      .then(function () {
        return repo.getBranchCommit(branch)
      })
  }
}

function callbackOnChange (cb) {
  var lastCommitId = null
  return function (commit) {
    var commitId = commit.id()
    if (lastCommitId == null || !commitId.equal(lastCommitId)) {
      lastCommitId = commitId
      cb(null, commit)
    }
  }
}
