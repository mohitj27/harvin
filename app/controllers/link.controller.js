const Link = require('./../models/Link')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const insertLink=link=>{
  return new Promise((resolve,reject)=>{
    Link.create(link,(err,createdLink)=>{
      if(err) reject(err)
      else resolve(createdLink)
    })
  })
}
const getAllLinks=()=>{
  return new Promise((resolve,reject)=>{
    Link.find({},(err,foundLinks)=>{
      if(err)reject(err)
      resolve(foundLinks)
    })
  })
}
const getDownloadFileByTitle=(linkTitle)=>{
  return new Promise((resolve,reject)=>{
    Link.findOne({linkTitle},(err,foundLink)=>{
      if(err)reject(err)
      resolve(foundLink)
    })
  })
}
module.exports = {
insertLink,
getAllLinks,
getDownloadFileByTitle
}
