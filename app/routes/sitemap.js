const express = require('express')
const resultController = require('../controllers/result.controller')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')
const path = require("path");


const router = express.Router()
// TODO: student batch in db
router.get('/', async (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/sitemap.xml"));
})

module.exports = router
