var express = require("express");
var router  = express.Router();
// var request = require("request");
var db		= require("../models");
var session = require("express-session");
var CollabInt = require("../test.js")

CollabInt = new CollabInt();


router.get("/", function(req, res) {
	if(req.session.aNumber == undefined){
		req.session.aNumber = 1;
	}
	req.session.aNumber++;

	if(req.session.userName){
		CollabInt.allData(req, res, req.session.userName);
	} else{
		CollabInt.allData(req, res, "false");
	}
});

router.route("/login")
	.get(function(req, res){
		res.render("login");
	})
	.post(function(req, res){
		db.user.authenticate(
			req.body.email, 
			req.body.password, 
			function(err, user){
				if(err){
					res.send(err);
				} else if (user) {
					req.session.user = user.id;
					db.user.findById(user.id).then(function(user){
						req.session.userName = user.name;
						console.log(user.name);
						req.flash("success", "You are logged in, Welcome");
						res.redirect("/");
					});
					
				} else {
					req.flash("danger", "Invalid username or password");
					res.redirect("/login");
				}
			}
		);
	});

router.get("/logout", function(req, res){
	req.flash("info","You have been logged out");
	req.session.user = false;
	req.session.userName = false;
	res.redirect("/");
});

router.route("/signup")
	.get(function(req, res){
		res.redirect("login");
	})
	.post(function(req, res){
		if(req.body.password !== req.body.password2){
			req.flash("danger", "Passwords must match!");
			res.redirect("login");
		} else {
			db.user.findOrCreate({
				where : {
					email: req.body.email
				},
				defaults: {
					email: req.body.email,
					password: req.body.password,
					name: req.body.firstName + " " + req.body.lastName
				}
			}).spread(function(user, created){
				if(created){
					req.session.user = user.id;
					req.session.userName = user.name;

					console.log(req.session);
					req.flash("success", "You are signed up.");
					res.redirect("/");
				} else {
					req.flash("danger", "A user with that email already exists.");
					res.redirect("login");
				}
			}).catch(function(err){
				req.flash("danger", "an error occured " + err);
				res.redirect("login");
			});
		}
	});

router.get("/ask", function(req, res){
	if(req.session.user == undefined){
		req.flash("danger", "Please log in");
		res.redirect("/");
	}
	
	res.render("askQuesion");
});
var dataF = {};
router.post("/poll", function(req, res){
	// req.session.userPoll = req.body;
	// dataF = req.body;
	// // res.send(req.session);
	// res.render("poll", {data: req.body, req : req});
	// console.log(req.session.user);
	var choices = [];
	var innerArr = [];
	var length = Object.keys(req.body).length;
	for(var i=0;i<length-2;i++){
		var choice = "choice" + i.toString();
		console.log(choice)
     if(i !== "category" && i !== "question"){
     	innerArr = [];
 		innerArr.push(req.body[choice],1);
  	 		choices.push(innerArr);
      }
 	}

 	console.log(choices);
 	CollabInt.addPoll(req.body.category, req.body.question, choices, true, res, req.session.user);
});

router.get("/closePoll/:id", function(req, res){
	
	CollabInt.closePoll(req.params.id, CollabInt);
	res.redirect("/");
});

router.get("/questions", function(req, res){
	CollabInt.getQuestions(res);
});

router.get("/poll/:id", function(req, res){
	if(req.session.user == undefined){
		req.flash("danger", "Please log in");
		res.redirect("/");
	}
	
	CollabInt.getPoll(req.params.id, res, req.session.user);
	// res.render("poll", {data: dataF});
});
router.get("/about", function(req, res){
	res.render("about");
});
module.exports = router;
