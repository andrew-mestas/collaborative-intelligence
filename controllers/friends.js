var express = require("express");
var router  = express.Router();
var db		= require("../models");
var CollabInt = require("../test.js");
	
	CollabInt = new CollabInt();

router.get("/", function(req, res){
	CollabInt.getFriend(res.locals.name, req);
	res.send(req.session);

});

router.post("/add", function(req, res){
	CollabInt.addFriend(req.name, req.body.friendEmail);
	res.redirect("/");

});


module.exports = router;
