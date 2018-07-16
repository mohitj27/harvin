const express = require('express');
const router = express.Router();


router.get('/', function(req, res){
    console.log('404ing');
    res.render("invalid_page");
  });

  module.exports = router