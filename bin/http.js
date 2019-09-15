const Api = require(__dirname + '/../src/interfaces/http')

async function main() {
  const api = new Api()

  process.on('SIGINT', async () => {
    console.info('SIGINT signal received.')
    await api.close()
    process.exit(0)
  })
}

main()
