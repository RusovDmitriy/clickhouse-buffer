const Loader = require('../../../src/jobs/Loader')

const table = 'chbuffer.test'
process.env.LOG_OFF = '1'

describe('jobs => loader', () => {
  const loader = new Loader({ table })

  const { bufferService, redis } = loader.container.cradle

  beforeAll(async () => {
    bufferService.clear({ table })
  })

  afterAll(() => {
    redis.quit()
  })

  it('Try load records, after buffer should be empty', async () => {
    const data = {
      table,
      values: [
        {
          date: '2019-01-01',
          time: '2019-01-01 00:00:01',
          uid: '563de27a-c481-4f5c-831e-467f579a2a15',
          url: 'http://test.com',
          count: 10
        },
        {
          date: '2019-01-01',
          time: '2019-01-01 00:00:02',
          uid: 'dfbdb91f-8760-4fd4-af7b-a788ebc1155b',
          url: 'http://test.com',
          count: 12
        }
      ]
    }

    await bufferService.write(data)

    await loader.start({ once: true })
    const records = await bufferService.read({ table, length: 2 })
    expect(records.length).toBe(0)
  })

  it('Try load diff records,separate by 3 inserts, after buffer should be empty', async () => {
    const data = {
      table,
      values: [
        {
          date: '2019-01-01',
          time: '2019-01-01 00:00:01',
          uid: '563de27a-c481-4f5c-831e-467f579a2a15',
          url: 'http://test.com',
          count: 10
        },
        {
          date: '2019-01-01',
          time: '2019-01-01 00:00:02',
          uid: 'dfbdb91f-8760-4fd4-af7b-a788ebc1155b',
          url: 'http://test.com',
          count: 12
        },
        {
          date: '2019-01-01',
          time: '2019-01-01 00:00:02',
          url: 'http://test.com',
          count: 12
        },
        {
          date: '2019-01-01',
          uid: 'dfbdb91f-8760-4fd4-af7b-a788ebc1155b',
          url: 'http://test.com',
          count: 15
        }
      ]
    }

    await bufferService.write(data)

    await loader.start({ once: true })
    const records = await bufferService.read({ table, length: 100 })
    expect(records.length).toBe(2)

    await loader.start({ once: true })
    const records2 = await bufferService.read({ table, length: 100 })
    expect(records2.length).toBe(1)

    await loader.start({ once: true })
    const records3 = await bufferService.read({ table, length: 100 })
    expect(records3.length).toBe(0)
  })

  it('Try load invalid records', async () => {
    const data = {
      table,
      values: [
        {
          date: '2019-01-01',
          time: '2019-01-01 00:00:01',
          uid: '563de27a-c481-4f5c-831e-467f579a2a15',
          url: 'http://test.com',
          counttqw: 10
        }
      ]
    }

    await bufferService.write(data)

    await loader.start({ once: true })
    const records = await bufferService.read({ table, length: 100 })
    expect(records.length).toBe(1)
  })
})
