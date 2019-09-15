module.exports = () => {
  const Redis = require('ioredis')
  return new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  })
}
