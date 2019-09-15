function dateFormat() {
  var d = new Date()
  return (
    [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('.') +
    ' ' +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':')
  )
}

module.exports.log = (...args) => {
  if (process.env.LOG_OFF !== '1') console.log.apply(console, [dateFormat(), process.pid, '[log]', ...args])
}

module.exports.info = (...args) => {
  if (process.env.LOG_OFF !== '1') console.log.apply(console, [dateFormat(), process.pid, '[info]', ...args])
}

module.exports.error = (...args) => {
  if (process.env.LOG_OFF !== '1') console.error.apply(console, [dateFormat(), process.pid, '[error]', ...args])
}

module.exports.debug = (...args) => {
  if (process.env.DEBUG === '1') console.log.apply(console, [dateFormat(), process.pid, '[debug]', ...args])
}
