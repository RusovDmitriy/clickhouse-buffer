const TcpApi = require(__dirname + '/../src/interfaces/tcp')

async function main() {
  const api = new TcpApi()

  process.on('SIGINT', async () => {
    console.info('SIGINT signal received.')
    await api.close()
    process.exit(0)
  })
}

main()
