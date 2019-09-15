const http = require('http')
module.exports = cradle => {
  const {
    errors: { ClickhouseInsertError }
  } = cradle

  const servers = (process.env.CLICKHOUSE_SERVERS || '127.0.0.1:8123').split(',')

  return {
    insert({ table, keys }) {
      const query = `INSERT INTO ${table} (${keys.join(',')}) FORMAT TabSeparated`

      const [host, port] = servers[Math.floor(Math.random() * servers.length)].split(':')
      const options = {
        host,
        port,
        path: `/?query=${encodeURIComponent(query)}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      return http.request(options)
    },

    end(req) {
      return new Promise((resolve, reject) => {
        req.on('error', err => {
          reject(new ClickhouseInsertError(err.message))
        })

        req.once('response', res => {
          let body = ''
          res.on('data', function(chunk) {
            body += chunk.toString()
          })

          res.on('end', () => {
            if (body) reject(new ClickhouseInsertError(body))
            else resolve()
          })

          res.on('error', err => {
            console.error(err)
            reject(err)
          })
        })

        req.end()
      })
    }
  }
}
