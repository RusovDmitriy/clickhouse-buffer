module.exports = () => {
  const { asValue, asFunction, InjectionMode, createContainer } = require('awilix')

  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  })

  container.register({
    redis: asFunction(require('../../src/utils/redis')).singleton(),
    errors: asValue(require('../../src/utils/errors'))
  })

  container.register({
    bufferService: asFunction(require('../../src/services/BufferService')).singleton(),
    clickhouseService: asFunction(require('../../src/services/clickhouseService')).singleton()
  })

  return container
}
