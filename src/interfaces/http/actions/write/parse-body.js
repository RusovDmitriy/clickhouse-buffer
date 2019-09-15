module.exports = function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => (body += chunk.toString()))
    req.on('end', () => {
      try {
        body = JSON.parse(body)
        resolve(body)
      } catch (err) {
        reject(new Error('Bad request'))
      }
    })
    req.on('err', err => reject(err))
  })
}
