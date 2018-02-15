const errorHandler=require('../errorHandler/index'),
      Course=require('./../models/Course'),
      Promise=require('bluebird')

const findAllCourses=()=>{
  return new Promise((resolve,reject)=>{
    Course.find({},(err,foundBatches)=>{
      if(err) reject(err)
      else resolve(foundBatches)
    })
  })
}
const insertInCourse=(course)=>{
  return new Promise((resolve,reject)=>{
    Course.updateOne({courseName : course.courseName}, course,{upsert : true},(err,result)=>{
      if(err) reject(err)
      else {
        console.log("naman")
        resolve(true)}
    })
  })
}
module.exports={
  findAllCourses,
  insertInCourse
}
