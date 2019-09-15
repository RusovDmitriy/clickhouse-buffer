const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })

  const tables = (process.env.TABLES || 'default.test').split(',')

  for (const table of tables) {
    const { Worker } = require('worker_threads')
    new Worker(__dirname + '/loader.js', {
      workerData: {
        table
      }
    })
  }
} else {
  const Api = require(__dirname + '/../src/interfaces/http')
  const api = new Api()

  process.on('SIGINT', async () => {
    console.info('SIGINT signal received.')
    await api.close()
    process.exit(0)
  })
}
