var express = require("express");
var router  = express.Router();
var db		= require("../models");
var CollabInt = require("../test.js");
CollabInt = new CollabInt();

router.get("/",function(req, res){
	CollabInt.getMessage(req.session.user, res);
})

router.post("/send", function(req, res){
	console.log(req.body);
	CollabInt.createMessageName(req.body.from, req.body.to, req.body.title, req.body.content);
});

router.get("/friends", function(req, res){
	CollabInt.getFriend(req.session.user, req);
});

module.exports = router;

