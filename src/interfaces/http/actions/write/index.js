module.exports = cradle => {
  const { bufferService } = cradle
  const parseBody = require('./parse-body')

  return async (req, res) => {
    try {
      const data = await parseBody(req)
      await bufferService.write(data)
    } catch (err) {
      res.statusCode = err.code || 500
      res.write(JSON.stringify(err))
    }

    res.end()
  }
}
