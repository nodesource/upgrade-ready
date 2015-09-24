#!/usr/bin/env node

/*!
 * upgrade-ready
 * Copyright(c) 2015 NodeSource, Inc.
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var path = require('path')
var utils = require('util')
var url = require('url')
var fs = require('fs')
var rc = require('rc')
var request = require('client-request')
var extend = utils._extend
var gatherDependencies = require('gather-dependencies')

/**
 * Configuration
 */

var config = rc('upgrade-ready', {
  endpoint: 'http://upgrade-ready.nodesource.com/api/',
  verbose: false,
  targetVersion: '4.1.1',
  path: path.resolve('.')
})

// Use the first parameter as targetVersion
if (config._[0]) {
  config.targetVersion = config._[0]
}

/*
 * Exports
 */
if (module.parent) {
  module.exports = run
} else {
  run()
}

/**
 * Upgrade ready
 * @param  {object}   options         Options
 * @param  {function} callback        callback
 */
function upgradeReady (options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = extend(config, options)

  gatherDependencies(options.path, function cb (err, data) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }

    if (options.v || options.verbose) {
      console.log('Gathered dependencies:')
      console.log(utils.inspect(data, { showHidden: true, colors: true }))
    }

    var uriParsed = url.parse(options.endpoint)
    uriParsed.pathname = path.resolve(uriParsed.pathname, options.targetVersion)

    var postOpts = {
      uri: url.format(uriParsed),
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    request(postOpts, function callback (err, response, body) {
      if (err) return console.error(err.message)

      var msgParsed
      try {
        msgParsed = JSON.parse(body.toString()).message
      } catch (e) {
        msgParsed = body.toString()
      }

      console.log(msgParsed)
    })
  })
}

function run () {
  if (config.h || config.help) {
    var helpFile = path.join(__dirname, 'help.txt')
    var helpText = fs.readFileSync(helpFile)
    console.log(String(helpText))
    process.exit(0)
  }

  fs.stat(path.resolve(config.path, 'package.json'), function (err, stats) {
    if (err || !stats.isFile()) {
      console.error('ERROR: package.json file not found.')
      console.error('Provide a valid path to look using --path')
      console.error('A package.json file is needed to check dependencies list')
      console.error('Use --help to get more information')
      process.exit(1)
    }
    upgradeReady()
  })
}
