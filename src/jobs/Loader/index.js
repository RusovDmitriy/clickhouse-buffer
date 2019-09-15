const EventEmitter = require('events')

class Loader extends EventEmitter {
  constructor({ table }) {
    super()
    this.progress = true

    this.container = require('./container')()
    this.handler = this.container.build(require('./handler'))
    this.logger = this.container.cradle.logger
    this.table = table
  }

  async start({ once = false } = {}) {
    this.logger.info(`Start loader for table: ${this.table}`)
    while (this.progress) {
      const { inserts } = await this.handler({
        table: this.table,
        maxlength: 10000
      })

      if (inserts) this.logger.info(`Insert records: ${inserts}`)

      if (once) this.progress = false
      else await new Promise(resolve => setTimeout(resolve, 1000))
    }

    this.emit('end')
  }

  stop() {
    this.progress = false
    return new Promise(resolve => this.once('end', resolve))
  }
}

module.exports = Loader
