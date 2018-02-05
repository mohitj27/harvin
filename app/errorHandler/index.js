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
  } else {
    for (const errName in err.errors) {
      if (err.errors.hasOwnProperty(errName) && err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
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

const invalidName = function(next) {
  generatError(
    400,
    "INVALID_NAME",
    "Bad request! Name not provided or Invalid name.",
    next
  );
};

const invalidFile = function(next) {
  generatError(
    400,
    "INVALID_FILE",
    "Bad request! File not provided or Invalid file.",
    next
  );
};

const invalidAssignmentName = function(next) {
  generatError(
    400,
    "INVALID_ASSIGNMENT_NAME",
    "Bad request! Invalid assignment name provided.",
    next
  );
};

const invalidLastSubDate = function(next) {
  generatError(
    400,
    "INVALID_LAST_SUBMISSION_DATE",
    "Bad request! Invalid last submission date provided.",
    next
  );
};

const invalidBatch = function(next) {
  generatError(
    400,
    "INVALID_BATCH",
    "Bad request! Invalid batch provided.",
    next
  );
};

const invalidClassName = function(next) {
  generatError(
    400,
    "INVALID_CLASS_NAME",
    "Bad request! Invalid class name provided.",
    next
  );
};

const invalidSubjectName = function(next) {
  generatError(
    400,
    "INVALID_SUBJECT_NAME",
    "Bad request! Invalid subject name provided.",
    next
  );
};

const invalidChapterName = function(next) {
  generatError(
    400,
    "INVALID_CHAPTER_NAME",
    "Bad request! Invalid chapter name provided.",
    next
  );
};

const invalidTopicName = function(next) {
  generatError(
    400,
    "INVALID_TOPIC_NAME",
    "Bad request! Invalid topic name provided.",
    next
  );
};

const invalidChapterDesc = function(next) {
  generatError(
    400,
    "INVALID_CHAPTER_DESC",
    "Bad request! Invalid chaptper description provided.",
    next
  );
};

const notLoggedIn = function(next) {
  generatError(
    401,
    "NOT_LOGGED_IN",
    "Unauthorized! You need to be logged in",
    next
  );
};

const invalidPhone = function(next) {
  generatError(
    400,
    "INVALID_PHONE",
    "Bad request! Invalid Phone number provided.",
    next
  );
};

const invalidEmail = function(next) {
  generatError(
    400,
    "INVALID_EMAIL",
    "Bad request! Invalid Email provided.",
    next
  );
};

const invalidAddress = function(next) {
  generatError(
    400,
    "INVALID_ADDRESS",
    "Bad request! Invalid address provided.",
    next
  );
};

const invalidReferral = function(next) {
  generatError(
    400,
    "INVALID_REFERRAL",
    "Bad request! Invalid referral provided.",
    next
  );
};

const invalidSchool = function(next) {
  generatError(
    400,
    "INVALID_SCHOOL",
    "Bad request! Invalid school provided.",
    next
  );
};

const invalidAim = function(next) {
  generatError(
    400,
    "INVALID_AIM",
    "Bad request! Invalid aim provided.",
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

const errorResponse = function(name, next) {
  switch (name) {
    case "INVALID_NAME":
      invalidName(next);
      break;
    case "INVALID_PHONE":
      invalidPhone(next);
      break;
    case "INVALID_EMAIL":
      invalidEmail(next);
      break;
    case "INVALID_ADDRESS":
      invalidAddress(next);
      break;
    case "INVALID_REFERRAL":
      invalidReferral(next);
      break;
    case "INVALID_SCHOOL":
      invalidSchool(next);
      break;
    case "INVALID_AIM":
      invalidAim(next);
      break;
    case "INVALID_FILE":
      invalidFile(next);
      break;
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
    case "INVALID_ASSIGNMENT_NAME":
      invalidAssignmentName(next);
      break;
    case "INVALID_LAST_SUBMISSION_DATE":
      invalidLastSubDate(next);
      break;
    case "INVALID_BATCH":
      invalidBatch(next);
      break;
    case "INVALID_CLASS_NAME":
      invalidClassName(next);
      break;
    case "INVALID_SUBJECT_NAME":
      invalidSubjectName(next);
      break;
    case "INVALID_CHAPTER_NAME":
      invalidChapterName(next);
      break;
    case "INVALID_TOPIC_NAME":
      invalidTopicName(next);
      break;
    case "INVALID_CHAPTER_DESC":
      invalidChapterDesc(next);
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
