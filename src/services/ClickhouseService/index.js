const http = require('http')
const querystring = require('querystring')

module.exports = cradle => {
  const {
    errors: { ClickhouseInsertError }
  } = cradle

  const host = process.env.CLICKHOUSE_HOST || '127.0.0.1'
  const port = process.env.CLICKHOUSE_PORT || 8123
  const user = process.env.CLICKHOUSE_USER || 'default'
  const password = process.env.CLICKHOUSE_PASSWORD || ''

  return {
    insert({ table, keys }) {
      const query = `INSERT INTO ${table} (${keys.join(',')}) FORMAT TabSeparated`

      const qs = querystring.stringify({
        query,
        user,
        password
      })

      const options = {
        host,
        port,
        path: `/?${qs}`,
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
