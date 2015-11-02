var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("logger/logger.js");
var session = require("express-session");
var ejsLayout = require("express-ejs-layouts");
var collab = require("./controllers/collab");
var friend = require("./controllers/friends");
var flash = require("connect-flash");
var db = require("./models");

app.use(session({
	secret: "lubsijhawmno",
	resave: false,
	saveUninitialized: true
}));

app.use(express.static(__dirname + "/static"));
// app.use(logger);
app.use(ejsLayout);
app.use(bodyParser.urlencoded({extended:false}))
app.set("view engine", "ejs");
app.use(flash());



app.use(function(req,res,next){
	if(req.session.user){
		db.user.findById(req.session.user).then(function(user){
			if(user){
				req.currentUser = user;
				req.name = user.name;
				next();
			} else {
				req.currentUser = false;
				next();
			}
		});
	} else {
		req.currentUser = false;
		next();
	}
});
app.use(function(req, res, next){
	res.locals.currentUser = req.currentUser;
	res.locals.alerts = req.flash();
	res.locals.name = req.name;
	next();

});
app.use("/", collab);

app.use("/friends", friend);


////////////////////////////////////////////////////
////////////////////////////////////////////////////


// app.get("/", function(req, res){
// 	res.render("index");
// });


app.listen(process.env.PORT || 3000, function(){
	console.log("Working");
})
