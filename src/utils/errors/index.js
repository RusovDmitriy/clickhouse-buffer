module.exports = {
  ValidationError: class ValidationError extends Error {
    constructor(details) {
      super('ValidationError')
      this.details = details
      this.code = 422
    }
  },
  InternalError: class InternalError extends Error {
    constructor(details) {
      super('InternalError')
      this.details = details
      this.code = 500
    }
  },
  ClickhouseInsertError: class ClickhouseInsertError extends Error {
    constructor(details) {
      super('ClickhouseInsertError')
      this.details = details
      this.code = 500
    }
  }
}
