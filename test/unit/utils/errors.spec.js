const errors = require('../../../src/utils/errors')

describe('utils => errors', () => {
  it('should set properties', () => {
    expect(errors.ValidationError).toBeDefined()
    expect(errors.InternalError).toBeDefined()
    expect(errors.ClickhouseInsertError).toBeDefined()
  })

  it('ValidationError should set properties', () => {
    const details = { some: 1 }
    const ValidationError = new errors.ValidationError(details)

    expect(ValidationError.details).toEqual(details)
    expect(ValidationError.code).toEqual(422)
  })

  it('InternalError should set properties', () => {
    const details = { some: 1 }
    const InternalError = new errors.InternalError(details)

    expect(InternalError.details).toEqual(details)
    expect(InternalError.code).toEqual(500)
  })

  it('ClickhouseInsertError should set properties', () => {
    const details = { some: 1 }
    const ClickhouseInsertError = new errors.ClickhouseInsertError(details)

    expect(ClickhouseInsertError.details).toEqual(details)
    expect(ClickhouseInsertError.code).toEqual(500)
  })
})
