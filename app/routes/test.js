const express = require("express");
const testController = require("../controllers/test.controller");
const errorHandler = require("../errorHandler/index");
const middleware = require("../middleware");
const validator = require("validator");
const router = express.Router();

router.post("/", middleware.isLoggedIn, async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const date = Date.now();
  console.log("body", body);
  console.log('user', user._id);

  try {
    const addedTest = await testController.addTest({
      created: date,
      createdBy: user._id,
      name: body.name,
      time: body.time,
      maxMarks: body.maxMarks,
      sections: JSON.parse(body.sections)
    });
    return res.json({
      success: true,
      msg: 'Test generated successfully. Test id is ' + addedTest._id
    })
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const testId = req.params.id || ''
  if (!testId || !validator.isMongoId(testId))
    return res.json({
      success: false,
      msg: 'Invalid test id'
    })
  try {
    const foundTests = await testController.getTests({
      _id: testId
    });
    if (!foundTests && !foundTests[0]) {
      return res.json({
        success: false,
        msg: 'Test not found'
      })
    }
    let foundTest = foundTests[0]
    foundTest = await testController.populateFieldsInTests(foundTest, ["createdBy", "sections.questions"])
    return res.json({
      success: true,
      tests: foundTests.reverse()
    });
  } catch (err) {
    next(err)
  }
})

router.delete("/:id", async (req, res, next) => {
  const testId = req.params.id || ''
  if (!testId || !validator.isMongoId(testId))
    return res.json({
      success: false,
      msg: 'Invalid test id'
    })
  try {
    const foundTests = await testController.getTests({
      _id: testId
    });
    if (!foundTests && !foundTests[0]) {
      return res.json({
        success: false,
        msg: 'Test not found'
      })
    }
    let foundTest = foundTests[0]
    await testController.removeTests({
      _id: testId
    })
    return res.json({
      success: true,
      msg: 'Test deleted successfully'
    });
  } catch (err) {
    next(err)
  }
})

router.get("/", middleware.isLoggedIn, async (req, res, next) => {
  const user = req.user
  try {
    let foundTests = await testController.getTests({
      createdBy: user._id
    });
    foundTests = await testController.populateFieldsInTests(foundTests, ["createdBy"])
    return res.json({
      success: true,
      tests: foundTests.reverse()
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;