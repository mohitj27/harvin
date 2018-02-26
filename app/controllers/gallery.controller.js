const Gallery = require('./../models/Gallery')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const deleteCategory = function (category) {
  return new Promise(function (resolve, reject) {
    Gallery
      .removeAsync({
        category
      })
      .then(() => resolve())
      .catch(err => reject(err))
  })
}

const deleteImageById = function (imageId) {
  return new Promise(function (resolve, reject) {
    Gallery
      .findByIdAndRemoveAsync(imageId)
      .then((deletedImage) => resolve(deletedImage))
      .catch(err => reject(err))
  })
}

const findAllImages = function () {
  return new Promise(function (resolve, reject) {
    Gallery
      .findAsync()
      .then((foundImages) => resolve(foundImages))
      .catch(err => reject(err))
  })
}

const createNewImage = function (newImage) {
  return new Promise(function (resolve, reject) {
    Gallery
      .create(newImage)
      .then((foundImages) => resolve(foundImages))
      .catch(err => reject(err))
  })
}

const createThumbImg = function (createdImage) {
  console.log('img', createdImage)
  let src = fs.createReadStream(createdImage.filePath)
  let parsedPath = path.parse(createdImage.filePath)
  var thumbDir = path.join(parsedPath.dir, 'thumb')
  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir)
  }

  let currTime = Date.now().toString() + '__'

  let thumbPath = path.join(parsedPath.dir, 'thumb', currTime + createdImage.fileName)
  let ws = fs.createWriteStream(thumbPath)
  var sharpStream = sharp().resize(300, 200)
  src.pipe(sharpStream).pipe(ws)
}

module.exports = {
  deleteCategory,
  deleteImageById,
  findAllImages,
  createNewImage,
  createThumbImg
}
