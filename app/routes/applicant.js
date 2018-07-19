const express = require("express");
const passport = require("passport");
const router = express.Router();
const validator = require("validator");
const _ = require("lodash");
const errorHandler = require("../errorHandler");
const middleware = require("../middleware");
const jwtConfig = require("../config/jwt");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");

router.get("/", (req, res, next) => {
    req.send('working well');
})

module.exports = router;
