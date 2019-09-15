const Loader = require('../../../src/jobs/Loader')

const table = 'chbuffer.test'

describe('jobs => loader', () => {
  const loader = new Loader({ table })

  const { bufferService } = loader.container.cradle

  beforeAll(async () => {
    bufferService.clear({ table })
  })

  it('should be', async () => {
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
    console.log(JSON.stringify(data))
    await bufferService.write(data)

    await loader.start({ once: true })
    const records = await bufferService.read({ table, length: 2 })
    expect(records.length).toBe(0)
  })
})
