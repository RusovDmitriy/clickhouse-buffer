const http = require('http')
module.exports = ({ errors: { ClickhouseInsertError } }) => {
  return {
    insert({ table, keys }) {
      const query = `INSERT INTO ${table} (${keys.join(',')}) FORMAT TabSeparated`
      const options = {
        host: process.env.CLICKHOUSE_HOST || '127.0.0.1',
        port: process.env.CLICKHOUSE_PORT || '8123',
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
          res.on('data', function(chunk) {
            console.log('Response: ' + chunk)
          })

          res.on('end', () => {
            resolve()
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
