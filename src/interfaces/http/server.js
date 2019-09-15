module.exports = cradle => {
  const { logger } = cradle
  const http = require('http')
  const port = process.env.PORT || 3000

  const routes = {
    'POST:/': require('./actions/write')(cradle)
  }

  const server = http.createServer((req, res) => {
    const key = `${req.method}:${req.url}`
    if (routes[key]) routes[key](req, res)
    else {
      res.end('Welcome clickhouse buffer')
    }
  })

  server.listen(port, err => {
    if (err) return logger.error('Server listen error:', err.message)
    logger.info(`Api server is listening on ${port}`)
  })

  return server
}
