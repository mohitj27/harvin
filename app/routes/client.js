const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const path = require("path");

router.get("/", (req, res) => {
    // res.render("login");
    // console.log("here");
    res.sendFile(path.join(__dirname, "../../client/harvinreact/build/app.html"));
  
  });
  

module.exports = router
