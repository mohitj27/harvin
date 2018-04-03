const multer = require('multer');
const Promise = require('bluebird');
const fs = require('fs');

const fileReadPromise = (location) =>
   new Promise((resolve, reject) => {
    fs.readFile(location, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });

const fileWriteMulterPromise = (location, fieldName) =>
   new Promise((resolve, reject) => {
    const storage = multer.diskStorage({
      destination: location,
      filename: function (req, file, callback) {
        callback(null, file.originalname);
      },
    });
    const upload = multer({
      storage: storage,
    }).single(fieldName);
    resolve(upload);
  });

const fileWritePromise = (location, fileName, data) =>
   new Promise((resolve, reject) => {
    checkAndCreateLocation(location);
    fs.writeFile(location + fileName, data, (err) => {
      if (err) reject(err);
      else resolve(filename);
    });
  });

function checkAndCreateLocation(location) {
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location);

    // console.log("making dir",location)
  }
}

module.exports = { fileWritePromise,
  fileReadPromise,
  fileWriteMulterPromise,
};
