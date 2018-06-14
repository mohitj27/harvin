const express = require("express");
const quesController = require("../controllers/question.controller");
const errorHandler = require("../errorHandler/index");
const middleware = require("../middleware");
const validator = require("validator");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const body = req.body;

  try {
    const addedQues = await quesController.addQuestion({
      question: body.question,
      options: JSON.parse(body.options)
    });
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const foundQuestions = await quesController.getQuestions();
    return res.json({
      questions: foundQuestions
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    console.log(req.params.id);
    const questionsAfterObjectDelete = await quesController.deleteQuestion({_id:req.params.id});
    console.log(questionsAfterObjectDelete);
    if(!questionsAfterObjectDelete){
      return res.json({
        success:false,
        msg:"Question Could not be deleted ."
      });
    }
    return res.json({
      questions: questionsAfterObjectDelete,
      success:true,
      msg:"Question Deleted Successfully ."
    });
  } catch (e) {
    console.log(e);
    return res.json({
      success:false,
      msg:"Question Could not be deleted ."
    });
  }
});

module.exports = router;
