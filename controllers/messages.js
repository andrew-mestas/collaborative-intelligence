var express = require("express");
var router  = express.Router();
var db		= require("../models");
var CollabInt = require("../test.js");
CollabInt = new CollabInt();

router.get("/",function(req, res){
	if(req.session.user == undefined){
	req.flash("danger", "Please log in");
	res.redirect("/");
	}
	
	CollabInt.getMessage(req.session.user, res);
})

router.post("/send", function(req, res){
	console.log(req.body);
	CollabInt.createMessageName(req.body.from, req.body.to, req.body.title, req.body.content);
});

router.get("/friends", function(req, res){
	if(req.session.user == undefined){
	req.flash("danger", "Please log in");
	res.redirect("/");
	}
	CollabInt.getFriend(req.session.user, req);
});

router.get("/users", function(req, res){
	if(req.session.user == undefined){
	req.flash("danger", "Please log in");
	res.redirect("/");
	}
	CollabInt.getUsers(res, req);

});


router.get("/add/:email", function(req, res){
	if(req.session.user == undefined){
	req.flash("danger", "Please log in");
	res.redirect("/");
	}
	var hasFriend = false;
	db.user.find({where:{
		name: res.locals.name
	}}).then(function(name){
  	   name.getFriend().then(function(friends){
  	   	friends.forEach(function(person){
  	   		if(person.email == req.params.email){
  	   			hasFriend = true;
  	   		}
  	   	});
  	   	console.log(req.params.email);
  	   	if(!hasFriend){
  	   		console.log("added");
		var body = "Hey please add me as a friend. Here is my email: " + name.email;
		CollabInt.addFriend(req.name, req.params.email);
		CollabInt.createMessage(req.currentUser.dataValues.id, req.params.email, "Friend Request", body);
		}
		res.redirect("../users");
		});

	});
});



module.exports = router;

