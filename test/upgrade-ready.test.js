var test = require('tap').test
var createServer = require('./helper')

/**
 * Tests to avoid regressions on some solved bugs
 */
test('upgrade-ready running without issues', function (t) {
  // Start server to offer mockups
  var mockServer = createServer(function () {
    // Define endpoint to mock
    process.env['upgrade-ready_endpoint'] = 'http://localhost:3000/upgrade-ready'

    // Include and run
    var upgradeReady = require('../upgrade-ready')
    t.doesNotThrow(upgradeReady)

    t.tearDown(function () { mockServer.close() })
    setTimeout(function () { t.end() }, 1500)
  }, 3000)
})
