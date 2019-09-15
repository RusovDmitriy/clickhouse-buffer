module.exports = function(cradle) {
  const Validator = require('fastest-validator')
  const {
    redis,
    errors: { ValidationError, InternalError }
  } = cradle

  const PREFIX = 'chbuffer'
  const validator = new Validator().compile({
    $$strict: true,
    table: { type: 'string', min: 1, max: 255 },
    values: {
      type: 'array',
      items: {
        type: 'object'
      }
    }
  })

  return {
    getKey(table) {
      return `${PREFIX}:${table}`
    },

    async write({ table, values }) {
      const isValid = validator({ table, values })
      if (isValid !== true) throw new ValidationError(isValid)
      const key = this.getKey(table)

      try {
        if (values.length > 1) {
          const multi = redis.multi()
          for (const value of values) {
            multi.rpush(key, JSON.stringify(value))
          }
          await multi.exec()
        } else if (values.length === 1) {
          await redis.rpush(key, JSON.stringify(values[0]))
        }
      } catch (err) {
        throw new InternalError(err.message)
      }
    },
    read({ table, length }) {
      const key = this.getKey(table)
      return redis.lrange(key, 0, length)
    },
    remove({ table, length }) {
      const key = this.getKey(table)
      return redis.ltrim(key, length, -1)
    },
    clear({ table }) {
      const key = this.getKey(table)
      return redis.del(key)
    }
  }
}
