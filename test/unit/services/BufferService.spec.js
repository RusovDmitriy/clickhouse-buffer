const errors = require('../../../src/utils/errors')
const Buffer = require('../../../src/services/BufferService')

describe('services => BufferService', () => {
  function createBuffer({ error = false } = {}) {
    const multi = {
      rpush: jest.fn(),
      exec: jest.fn(() => {
        if (error) throw new Error('Some internal error')
      })
    }

    const redis = {
      rpush: jest.fn(),
      lrange: jest.fn(),
      ltrim: jest.fn(),
      del: jest.fn(),
      multi: jest.fn(() => multi)
    }

    return {
      redis,
      multi,
      buffer: new Buffer({
        redis,
        errors
      })
    }
  }

  it('should set properties', () => {
    const { buffer } = createBuffer()
    expect(buffer.getKey).toBeDefined()
    expect(buffer.write).toBeDefined()
    expect(buffer.read).toBeDefined()
  })

  it('should throw ValidationError', async () => {
    const { buffer } = createBuffer()
    try {
      await buffer.write({ table2: 'test', values: [] })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('ValidationError')
      expect(err.details).toEqual([{ type: 'required', field: 'table', message: "The 'table' field is required!" }])
    }
  })

  it('should throw InternalError', async () => {
    const { buffer } = createBuffer({ error: true })
    try {
      await buffer.write({ table: 'test', values: [{}, {}] })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('InternalError')
      expect(err.details).toEqual('Some internal error')
    }
  })

  it('should not write record', async () => {
    const { buffer, redis } = createBuffer()
    await buffer.write({ table: 'test', values: [] })
    expect(redis.rpush.mock.calls.length).toBe(0)
  })

  it('should write one record', async () => {
    const { buffer, redis } = createBuffer()
    const record = { table: 'test', values: [{ test: 1 }] }
    await buffer.write(record)

    expect(redis.rpush.mock.calls.length).toBe(1)

    const equal = [buffer.getKey(record.table), JSON.stringify(record.values[0])]
    expect(redis.rpush.mock.calls[0]).toEqual(equal)
  })

  it('should write multi record', async () => {
    const { buffer, redis, multi } = createBuffer()
    const record = { table: 'test', values: [{ test: 1 }, { test: 2 }] }
    await buffer.write(record)
    expect(redis.rpush.mock.calls.length).toBe(0)
    expect(redis.multi.mock.calls.length).toBe(1)
    expect(multi.rpush.mock.calls.length).toBe(2)
    expect(multi.rpush.mock.calls).toEqual([
      [buffer.getKey(record.table), JSON.stringify(record.values[0])],
      [buffer.getKey(record.table), JSON.stringify(record.values[1])]
    ])

    expect(multi.exec.mock.calls.length).toBe(1)
  })

  it('should read records', async () => {
    const { buffer, redis } = createBuffer()
    await buffer.read({ table: 'test', length: 10 })
    expect(redis.lrange.mock.calls.length).toBe(1)
  })

  it('should remove records', async () => {
    const { buffer, redis } = createBuffer()
    await buffer.remove({ table: 'test', length: 10 })
    expect(redis.ltrim.mock.calls.length).toBe(1)
  })

  it('should clear records', async () => {
    const { buffer, redis } = createBuffer()
    await buffer.clear({ table: 'test' })
    expect(redis.del.mock.calls.length).toBe(1)
  })
})
