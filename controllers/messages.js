var express = require("express");
var router  = express.Router();
var db		= require("../models");
var CollabInt = require("../test.js");
CollabInt = new CollabInt();

router.get("/",function(req, res){
	CollabInt.getMessage(req.session.user, res);
})

module.exports = router;

