var test = require('tap').test
var createServer = require('./helper')

test('upgrade-ready against bad endpoint', function (t) {
  // Start server to offer mockups
  var mockServer = createServer(function () {
    // Define endpoint to mock
    process.env['upgrade-ready_endpoint'] = 'http://localhost:3001/notFounds'

    // Include and run
    var upgradeReadyOther = require('../upgrade-ready')
    t.doesNotThrow(upgradeReadyOther)

    t.tearDown(function () { mockServer.close() })
    setTimeout(function () { t.end() }, 1500)
  }, 3001)
})
