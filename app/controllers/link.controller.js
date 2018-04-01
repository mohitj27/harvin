const Link = require('./../models/Link');
Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const insertLink = link =>
   new Promise((resolve, reject) => {
    Link.create(link, (err, createdLink) => {
      if (err) reject(err);
      else resolve(createdLink);
    });
  });

const getAllLinks = () =>
   new Promise((resolve, reject) => {
    Link.find({}, (err, foundLinks) => {
      if (err) reject(err);
      resolve(foundLinks);
    });
  });

const getDownloadFileByTitle = linkTitle =>
  new Promise((resolve, reject) => {
    Link.findOne({ linkTitle }, (err, foundLink) => {
      if (err) reject(err);
      resolve(foundLink);
    });
  });

const updateDownloadFileByTitle = linkTitle =>
   new Promise((resolve, reject) => {
    Link.findOneAndUpdateAsync({ linkTitle }, { $inc: { downloads: 1 } })
      .then(updatedLink => resolve(updatedLink))
      .catch(err => reject(err));
  });

const delteLinkUsingTitle = linkTitle =>
   new Promise((resolve, reject) => {
    Link.remove({ linkTitle }, (err, deletedLink) => {
      if (err) reject(err);
      resolve(deletedLink);
    });
  });

module.exports = {
  insertLink,
  getAllLinks,
  getDownloadFileByTitle,
  delteLinkUsingTitle,
  updateDownloadFileByTitle,
};
