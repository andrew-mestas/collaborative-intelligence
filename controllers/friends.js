var express = require("express");
var router  = express.Router();
var db		= require("../models");
var CollabInt = require("../test.js");
	
	CollabInt = new CollabInt();

router.get("/", function(req, res){
	if(req.session.user == undefined){
	req.flash("danger", "Please log in");
	res.redirect("/");
	}
	CollabInt.getFriend(res.locals.name, req);
});

router.post("/add", function(req, res){
	if(req.session.user == undefined){
	req.flash("danger", "Please log in");
	res.redirect("/");
	}

	db.user.find({where:{
		name: res.locals.name
	}}).then(function(name){
		var body = "Hey please add me as a friend. Here is my email: " + name.email;
		CollabInt.addFriend(req.name, req.body.friendEmail);
		CollabInt.createMessage(req.currentUser.dataValues.id, req.body.friendEmail, "Friend Request", body);
		res.redirect("/");
	});
});


module.exports = router;
