module.exports = cradle => {
  const { bufferService, logger } = cradle

  const net = require('net')
  const JsonSocket = require('json-socket')

  const port = 9838
  const server = net.createServer()

  server.listen(port, () => {
    console.log('Start listen tcp', port)
  })

  server.on('connection', socket => {
    console.log('Start connection')
    socket = new JsonSocket(socket)
    socket.on('message', async data => {
      try {
        await bufferService.write(data)
      } catch (err) {
        logger.error(JSON.stringify(err))
      }
    })
  })

  return server
}
