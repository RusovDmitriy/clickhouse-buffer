module.exports = cradle => {
  const { bufferService, clickhouseService, logger } = cradle

  function parseAndCheckSign(row, startKeysSign) {
    const record = JSON.parse(row)
    const keysSign = Object.keys(record).join(',')
    return { record, sign: keysSign === startKeysSign }
  }

  return async ({ table, maxlength }) => {
    const data = await bufferService.read({ table, length: maxlength })

    let inserts = 0

    if (data.length) {
      const keys = Object.keys(JSON.parse(data[0]))
      const startKeysSign = keys.join(',')

      const chInsertStream = clickhouseService.insert({ table, keys })

      for (let row of data) {
        const { record, sign } = parseAndCheckSign(row, startKeysSign)
        if (!sign) break
        chInsertStream.write(Object.values(record).join('\t') + '\n')
        inserts++
      }

      if (inserts) {
        try {
          await clickhouseService.end(chInsertStream)
          await bufferService.remove({ table, length: inserts })
        } catch (err) {
          inserts = 0
          throw err
        }
      }
    }

    return { inserts }
  }
}
