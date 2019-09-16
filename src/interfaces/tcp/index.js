class TcpApi {
  constructor() {
    const container = require('../container')()
    this.server = container.build(require('./server'))
  }

  close() {
    this.server.close()
  }
}

module.exports = TcpApi
