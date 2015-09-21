var http = require('http')

/*
 * Mockup server to run tests against it
 */
function createServer (callback, port) {
  return http.createServer(function (req, res) {
    if (req.url.split('/')[1] !== 'upgrade-ready') {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'OK' }))
    }
  }).listen(port, callback)
}

module.exports = createServer
