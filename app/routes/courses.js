const express=require('express'),
      router=express.Router()



router.get('/new',(req,res)=>{
  res.render('newCourse')
})

module.exports = router
