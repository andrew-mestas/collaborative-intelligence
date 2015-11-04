var express = require("express");
var router  = express.Router();
var db		= require("../models");
var CollabInt = require("../test.js");

router.get("/",function(req, res){

	res.render("message", {name: res.locals.name});
})

module.exports = router;

