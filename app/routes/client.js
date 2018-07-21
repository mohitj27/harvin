const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const path = require("path");
const studentController = require("../controllers/student.controller");


// Handles the HarvinQuiz Student Login
router.post("/student/login", async function (req, res, next) {
    try {
      const studentToken = await studentController.loginWithJWT(req.body);
      res.send(studentToken);
    } catch (e) {
      console.log(e);
      next(e);
    } finally {
      console.log("GOne into finally\n")
    }
});

router.get("/", (req, res) => {
    // res.render("login");
    // console.log("here");
    res.sendFile(path.join(__dirname, "../../client/harvinreact/build/app.html"));

});

router.get("*", (req, res) => {
    // res.render("login");
    // console.log("here");
    res.sendFile(path.join(__dirname, "../../client/harvinreact/build/app.html"));

});


module.exports = router
