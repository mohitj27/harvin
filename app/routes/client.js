const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const path = require("path");
const studentController = require("../controllers/student.controller");


// Sign up route for Harvin QUiz student
router.post('/applicant/signup', async (req, res, next) => {
  try {
      console.log("\ninside signup\n")
      const result = await studentController.registerHarvinStudent(req.body);
      console.log('\n\nres after coming from student controller is: ', result, '\n\n')
      res.sendStatus(200);
  } catch (err) {
      next(err || 'Internal Server Error')
  }
})


// Handles the HarvinQuiz Student Login
router.post("/applicant/login", async (req, res, next) => {
    console.log("'\nhere'\n'\n")
    console.log("\n\nreq.body is : ", req.body, '\n\n')  
    try {
      const studentToken = await studentController.loginWithJWT(req.body);
      res.send(studentToken);
    } catch (e) {
      console.log("\n\nerror: ", e);
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
