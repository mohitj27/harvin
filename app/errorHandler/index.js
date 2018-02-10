var getUniqueErrorMessage = function(err) {
  let output;

  try {
    const fieldName = err.errmsg.substring(
      err.errmsg.lastIndexOf(".$") + 2,
      err.errmsg.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};

var getErrorMessage = function(err) {
  console.log('errrrr', err.message);
  let message = "";

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
    }
  } else if(err.errors) {
    for (const errName in err.errors) {
      if (err.errors.hasOwnProperty(errName) && err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  } else {
    message = err.message
  }

  return message;
};

const rejectPromiseWithErrMsg = function(err) {
  const msg = getErrorMessage(err);
  deferred.reject(err.name + ": " + msg);
};

const generatError = function(status, name, message, next) {
  const err = new Error();
  err.status = status || 400;
  err.name = name || "BAD_REQUEST";
  err.message =
    message || "Bad request! Please modify request to suitable format";

  next(err);
};

const notLoggedIn = function(next) {
  generatError(
    401,
    "NOT_LOGGED_IN",
    "Unauthorized! You need to be logged in",
    next
  );
};

const notCenter = function(next) {
  generatError(403, "NOT_A_CENTER", "Forbidden! Please login into Center Account", next);
};

const notAdmin = function(next) {
  generatError(403, "NOT_AN_ADMIN", "Forbidden! Please login into Admin Account", next);
};

const notCenterOrAdmin = function(next) {
  generatError(403, "NOT_A_CENTER_OR_ADMIN", "Forbidden! Please login into Admin or Center Account", next);
};

const defaultError = function(next) {
  generatError(500, "INTERNAL_SERVER_ERROR", "Something bad happened.", next);
};

const invalidField = function (fieldName, next) {
  console.log('called');
  generatError(400, "INVALID " + fieldName.toUpperCase(), "Bad request! " + fieldName + " not provided or invalid.", next);
}


const errorResponse = function(name, field, next) {
  switch (name) {
    case "INVALID_FIELD":
      invalidField(field, next)
    case "NOT_A_CENTER":
      notCenter(next);
      break;
    case "NOT_AN_ADMIN":
      notAdmin(next);
      break;
    case "NOT_A_CENTER_OR_ADMIN":
      notCenterOrAdmin(next);
      break;
    case "NOT_LOGGED_IN":
      notLoggedIn(next);
      break;
    default:
      defaultError(next);
      break;
  }
};

module.exports = {
  getErrorMessage,
  rejectPromiseWithErrMsg,
  errorResponse
};
