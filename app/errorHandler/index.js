const ERROR_TYPES = {
  INVALID_FIELD: 'INVALID_FIELD',
  NOT_FOUND: 'NOT_FOUND',
  NOT_LOGGED_IN: 'NOT_LOGGED_IN',
  NOT_A_CENTER: 'NOT_A_CENTER',
  NOT_AN_ADMIN: 'NOT_AN_ADMIN',
  NOT_A_CENTER_OR_ADMIN: 'NOT_A_CENTER_OR_ADMIN',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
}

var getUniqueErrorMessage = function (err) {
  let output

  try {
    const fieldName = err.errmsg.substring(
      err.errmsg.lastIndexOf('.$') + 2,
      err.errmsg.lastIndexOf('_1')
    )
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      ' already exists'
  } catch (ex) {
    output = 'Unique field already exists'
  }

  return output
}

var getDuplicateErrorMsg = function (err) {
  let output

  try {
    const fieldName = err.errmsg.substring(
      err.errmsg.lastIndexOf('index') + 7,
      err.errmsg.lastIndexOf('_1')
    )
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      ' already exists'
  } catch (ex) {
    output = 'Unique field already exists'
  }
  return output
}

var getErrorMessage = function (err) {
  let message = ''

  if (err.code) {
    console.error('err_code: ', err.code)
    switch (err.code) {
      case 11000:
        message = getDuplicateErrorMsg(err)
        break
      case 11001:
        message = getUniqueErrorMessage(err)
        break
      case 'invalid_token':
        message = err.message
        break
      case 'credentials_required':
        message = err.message
        break
      case 'ENOENT':
        message = err.message
        break
      default:
        message = 'Something went wrong'
    }
  } else if (err.errors) {
    for (const errName in err.errors) {
      if (err.errors.hasOwnProperty(errName) && err.errors[errName].message) {
        message = err.errors[errName].message
      }
    }
  } else {
    message = err.message
  }

  return message
}

const generatError = function (
  status,
  name,
  message,
  next,
  toShowNotFound = false,
  toReport = true
) {
  const err = new Error()
  err.status = status || 400
  err.name = name || 'BAD_REQUEST'
  err.message =
    message || 'Bad request! Please modify request to suitable format'
  err.toShowNotFound = toShowNotFound
  err.toReport = toReport
  next(err || 'Internal Server Error')
}

const notLoggedIn = function (next) {
  generatError(
    401,
    'NOT_LOGGED_IN',
    'Unauthorized! You need to be logged in',
    next
  )
}

function jsUcfirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const notCenter = function (next) {
  generatError(
    403,
    'NOT_A_CENTER',
    'Forbidden! Please login into Center Account',
    next
  )
}

const notAdmin = function (next) {
  generatError(
    403,
    'NOT_AN_ADMIN',
    'Forbidden! Please login into Admin Account',
    next
  )
}

const notCenterOrAdmin = function (next) {
  generatError(
    403,
    'NOT_A_CENTER_OR_ADMIN',
    'Forbidden! Please login into Admin or Center Account',
    next
  )
}

const defaultError = function (msg, next, toShowNotFound, toReport) {
  msg = msg === null ? 'Something bad happened.' : msg
  generatError(
    500,
    ERROR_TYPES.INTERNAL_SERVER_ERROR,
    msg,
    next,
    toShowNotFound,
    toReport
  )
}

const invalidField = function (fieldName, next, toShowNotFound, toReport) {
  generatError(
    400,
    'INVALID ' + fieldName.toUpperCase(),
    'Bad request! ' + jsUcfirst(fieldName) + ' not provided or invalid.',
    next,
    toShowNotFound,
    toReport
  )
}

const notFound = function (fieldName, next, toShowNotFound, toReport) {
  generatError(
    404,
    fieldName.toUpperCase() + ' NOT FOUND',
    jsUcfirst(fieldName) + ' not found or undefined.',
    next,
    toShowNotFound,
    toReport
  )
}

const errorResponse = function (
  name = '',
  field = 'Something bad happened.',
  next,
  toShowNotFound = false,
  toReport = true
) {
  switch (name) {
    case ERROR_TYPES.INVALID_FIELD:
      invalidField(field, next, toShowNotFound, toReport)
      break
    case ERROR_TYPES.NOT_FOUND:
      notFound(field, next, toShowNotFound, toReport)
      break
    case ERROR_TYPES.INTERNAL_SERVER_ERROR:
      defaultError(field, next, toShowNotFound, toReport)
      break
    case ERROR_TYPES.NOT_A_CENTER:
      notCenter(next)
      break
    case ERROR_TYPES.NOT_AN_ADMIN:
      notAdmin(next)
      break
    case ERROR_TYPES.NOT_A_CENTER_OR_ADMIN:
      notCenterOrAdmin(next)
      break
    case ERROR_TYPES.NOT_LOGGED_IN:
      notLoggedIn(next)
      break
    default:
      defaultError(next)
      break
  }
}

module.exports = {
  getErrorMessage,
  errorResponse,
  ERROR_TYPES
}
