const EventEmitter = require('events')

class Loader extends EventEmitter {
  constructor({ table }) {
    super()
    this.progress = false

    this.container = require('./container')()
    this.handler = this.container.build(require('./handler'))
    this.logger = this.container.cradle.logger
    this.table = table
  }

  async start({ once = false } = {}) {
    if (!this.progress) {
      this.progress = true
      this.logger.info(`Start loader for table: ${this.table}`)
      while (this.progress) {
        try {
          const { inserts } = await this.handler({
            table: this.table,
            maxlength: 10000
          })

          if (inserts) this.logger.info(`Insert records: ${inserts}`)
        } catch (err) {
          this.logger.error(err.message)
        }

        if (once) this.progress = false
        else await new Promise(resolve => setTimeout(resolve, 1000))
      }

      this.emit('end')
    }
  }

  stop() {
    this.progress = false
    return new Promise(resolve =>
      this.once('end', () => {
        this.container.cradle.redis.quit()
        resolve()
      })
    )
  }
}

module.exports = Loader
