module.exports = () => {
  const { asValue, asFunction, InjectionMode, createContainer } = require('awilix')

  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  })

  container.register({
    redis: asFunction(require('../../utils/redis')).singleton(),
    errors: asValue(require('../../utils/errors')),
    logger: asValue(require('../../utils/logger'))
  })

  container.register({
    bufferService: asFunction(require('../../services/BufferService')).singleton(),
    clickhouseService: asFunction(require('../../services/ClickhouseService')).singleton()
  })

  return container
}
