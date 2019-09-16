const { workerData } = require('worker_threads')

const Loader = require(__dirname + '/../src/jobs/Loader')

function main() {
  const loader = new Loader({ table: (workerData && workerData.table) || process.env.TABLE || 'default.test' })

  loader.start()

  process.on('SIGINT', async () => {
    console.info('SIGINT signal received.')
    await loader.stop()
    process.exit(0)
  })
}

main()
