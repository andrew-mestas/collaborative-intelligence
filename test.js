var db = require("./models");
var async = require("async")
// var categoryText = "Pets";
// var questions = "What should I get cat or dog?";
// var answer1   = "Cat";
// var answerRank1 = 65;
// var answer2   = "Dog";
// var answerRank2 = 35;

// var data = [[categoryText, questions],[answer1, answerRank1],[answer2, answerRank2]];
// var len = data.length;
// var num = 1;

// var categoryText = "Every day";
// var questions = "Boots, sandals, or barefeet?";
// var answer1   = "Boots";
// var answerRank1 = 55;
// var answer2 = "sandals";
// var answerRank2 = 25;
// var answer3 = "barefeet";
// var answerRank3 = 20;

// var data = [[categoryText, questions],[answer1, answerRank1],[answer2, answerRank2],[answer3, answerRank3]];
// var len = data.length;
// var num = 1;

// var categoryText = "Every day";
// var questions = "Should I go to work today";
// var answers   = "Yes";
// var answerRank = 45;

function CollabInt(){

};



// // Delete

// db.choice.findAll().then(function(t){
// 	t.forEach(function(com){
// 	com.destroy().then(function(){});
// 	});
// })

// db.question.findAll().then(function(t){
// 	t.forEach(function(com){
// 	com.destroy().then(function(){});
// 	});
// })
// db.answer.findAll().then(function(t){
// 	t.forEach(function(com){
// 	com.destroy().then(function(){});
// 	});
// })

// var userName = "Jerry";
// var emailString = "jerry@do.com";
// var passwordVal = "booyashazam";
// var prolevelvalue = 22;

// var userName = "Billy";
// var emailString = "billy@do.com";
// var passwordVal = "booyaTooya";
// var prolevelvalue = 33;
// var friendName = "Billy";
// var emailString = "";
// var passwordVal = "";





/////////////////////// Login ///////////////////////////////// 
//  accepts email and password - if valid returns true
//   otherwise false
///////////////////////////////////////////////////////////////

CollabInt.prototype.login = function(emailString, passwordVal){
db.user.authenticate(
	emailString,
	passwordVal,
	function(err, user){
	if(err){
		console.log("Error");
		return false;
	} else if (user){
		console.log(user.name + " logged in");
		return true;
	} else {
		console.log("Invalid username or password");
		return false;
	 }
    }
  );
};

////////////////////////////////////////////////////////////////
//  accepts username returns an object containing an 
//   array of friends
///////////////////////////////////////////////////////////////


CollabInt.prototype.getFriend = function(userName, req){
	var friendObj = {};
	var friends = [];
db.user.find({where: {
	name: userName
}}).then(function(user){
	if(user){
	  user.getFriend().then(function(friends){
	  if(friends){
	   friends.forEach(function(person){
	   console.log(user.name + " is a friend of " + person.name);
	   friends.push(person.name);
	   });
	   friendObj.friend = friends;
	   console.log(friendObj);
	   req.session.friend= friendObj;
	   // callback.render("friends",{friends: friends});
	   } else {
			return false;
	   };
	 });
    } else {
    	return false;
    }
 });
};

/////////////////////////////////////////////////////////////////////
//  Takes in username email password and prolevelvalue default = 0
//	 if user is created returns true else false
/////////////////////////////////////////////////////////////////////

CollabInt.prototype.addUser = function(userName, emailString, passwordVal, prolevelvalue){
	var createdUser = null;
db.user.findOrCreate({where: {
	name: userName,
	email: emailString,
	password: passwordVal,
	prolevel: prolevelvalue || 0
}}).spread(function(newUser, created){
	console.log(newUser.get());
	createdUser = created;
 });
	if(createUser){
	 return true;
	} else {
	 return false;
	}
};

///////////////////////////////////////////////////////////////////
//  Takes in username and friends name to add 
//   returns true if successful else false
//////////////////////////////////////////////////////////////////

CollabInt.prototype.addFriend = function(userName, friendEmail){
db.user.find({where:{
	name: userName
}}).then(function(person){
 if(person){
 	db.user.find({where : {
	email: friendEmail
 }}).then(function(newFriend){
 	if(newFriend){
	person.addFriend(newFriend);
	newFriend.addFriend(person); // COMMENT OUT FOR MORE PRIVACY ADD SEND REQUEST FOR FRIEND
	} else {
		return false;
	}
  });
} else {
	return false;
}
 });
};

//////////////////////////////////////////////////////////////////////
//  takes in an array of data in the following format 
//    [[categoryText, questions],[answer1, answerRank1],[answer..., answerRank...][answerLast, answerRankLast];
//////////////////////////////////////////////////////////////////////



CollabInt.prototype.storeData = function(data){
var len = data.length;
var num = 1;

function storeCQA(num){
db.category.findOrCreate({where: {
	name : data[0][0]
}}).spread(function(categoryItem, created){
db.question.findOrCreate({where: {
	question : data[0][1]
}}).spread(function(newQuestion, created){
	categoryItem.addQuestion(newQuestion).then(function(){
db.answer.findOrCreate({where: {
	answer : data[num][0],
	rank: data[num][1]
}}).spread(function(answerItem){
	categoryItem.addAnswer(answerItem).then(function(){
	  newQuestion.addAnswer(answerItem).then(function(){
	  console.log("Done");
	 });
	});
   });
  });
 });
});
};

var stop = setInterval(function(){
	storeCQA(num);
	num +=1;
	if(num == len)
	 clearInterval(stop);
}, 4000);
};

///////////////////////////////////////////////////////////////
//  Gets all questions and answers
//   returns true stores all data in a global variable
///////////////////////////////////////////////////////////////



CollabInt.prototype.getQandA = function(req, res){
var data = {"categories": [], data: {"questions": [], "answers" : [], "ranks": []}};

var cat = 0 ,
	que = 0,
	ans = 0;
var answerList = {};
var rankList = {};
var questionsCat = { };
var count = 0;

db.category.findAll({
	include: [db.question],
	order: [[db.question, "id"]]
}).then(function(questionItem){
db.question.findAll({
	include: [db.answer],
	order : [[db.answer, "id"]]
}).then(function(answerItem){
	questionItem.forEach(function(qt, counter){
		count= counter;
		// console.log("\nCategory:",qt.dataValues.name);
		data["categories"].push(qt.dataValues.name);
	questionItem[cat].dataValues.questions.forEach(function(q, i){
		questionsCat[que] = q.dataValues.question;
		// console.log(q.dataValues.question, que)
	answerItem[que].dataValues.answers.forEach(function(an, y){
		// console.log("Answer:",an.dataValues.answer,"\n");
		// console.log("Rank:",an.dataValues.rank,"\n");
		var answerToPut = an.dataValues.answer;
		var rankToPut = an.dataValues.rank;
		answerList[y]  =  answerToPut;
		rankList[y] = rankToPut;
  	  });
		data.data["answers"].push(answerList);
		data.data["ranks"].push(rankList);
		answerList = {};
		rankList = {};
		ans++;
   		que++;
    });
    // que=0;
    	data.data["questions"].push(questionsCat);
    	questionsCat = {};
    	cat++;
});
	console.log(data.data.answers);
	// .log(Object.keys(data.data.questions[1]).length);
	if(req.session.user){
		db.user.findById(req.session.user).then(function(user){
			if(user){
				req.currentUser = user;
				req.name = user.name;
			} else {
				req.currentUser = false;
			}
		});
	} else {
		req.currentUser = false;
	}
	console.log(req.session);
	if(res){
	res.render("index", {data: data, friends: " "});
	} else {
		console.log("NO");
		return(data);
	}
	});
});
};

CollabInt.prototype.allData = function(req, res, userName){

var data = {"categories": [], data: {"questions": [], "answers" : [], "ranks": []}};

var cat = 0,
	que = 0,
	ans = 0;
var answerList = {};
var rankList = {};
var questionsCat = { };
var count = 0;
var friendObj = {};
var friends = [];
var currentQuestions = {};
console.log(userName == "false");
if(userName == "false"){
	res.render("index", {data: null, friends: null, questions: null, user:false});
	return;
}

db.user.find({where: {
	name: userName 
}}).then(function(user){
	if(user){
	  user.getFriend().then(function(friends){
	  if(friends){
	   friends.forEach(function(person){
	   // console.log(user.name + " is a friend of " + person.name);
	   friends.push(person.name);
	   });
	   friendObj.friend = friends;
	   // console.log(friendObj);
	   } else {
			return false;
	   };

		db.category.findAll({
			order: "id",
			include: [db.question]
		}).then(function(questionItem){
			console.log()
		db.question.findAll({
			include: [db.answer],
			order: [[db.answer, 'categoryId']]
		}).then(function(answerItem){

			questionItem.forEach(function(qt, counter){
				count= counter;
				console.log("\nCategory:",qt.dataValues.name);
				data["categories"].push(qt.dataValues.name);
			questionItem[cat].dataValues.questions.forEach(function(q, i){
				questionsCat[que] = q.dataValues.question;
				console.log(q.dataValues.question, que)
			answerItem[que].dataValues.answers.forEach(function(an, y){
				console.log("Answer:",an.dataValues.answer,"\n");
				console.log("Rank:",an.dataValues.rank,"\n");
				var answerToPut = an.dataValues.answer;
				var rankToPut = an.dataValues.rank;
				answerList[y]  =  answerToPut;
				rankList[y] = rankToPut;
		  	  });
				data.data["answers"].push(answerList);
				data.data["ranks"].push(rankList);
				answerList = {};
				rankList = {};
				ans++;
		   		que++;
		    });
		    	data.data["questions"].push(questionsCat);
		    	questionsCat = {};
		    	cat++;
		});
			// console.log(data.data.answers);
			// console.log(friendObj, data);
	if(req.session.user){
		db.user.findById(req.session.user).then(function(user){
			if(user){
				req.currentUser = user;
				req.name = user.name;
			} else {
				req.currentUser = false;
			}
		});
	} else {
		req.currentUser = false;
	}

	db.poll.findAll().then(function(polls){
		polls.forEach(function(poll,i){
		currentQuestions[i] = poll;
		});
	if(userName){
	res.render("index", {data: data, friends: friendObj, questions: currentQuestions, user:true});
	} else {
	res.render("index", {data: data, user: false});
	}
	});

	});
		});
	 });
    } else {
    	return false;
    }
});

};
var category = "Every Day",
	question = "Does it look sunny or cloudy?";

var choices = [["Sunny", 0], ["Cloudy", 0], ["Neither" , 0]];


var addChoices = function(choices, callback){
	db.choice.findOrCreate({where:{
		choiceString : choices[0],
		value : choices[1]
	}}).spread(function(choice,created){
		callback(null,choice);
	});
};



CollabInt.prototype.addPoll = function(category, question, choices, active, res){

db.poll.findOrCreate({where:{
	category: category,
	question: question,
	active: active
}}).spread(function(poll, created){

async.concat(choices, addChoices, function(err, results) {
  console.log(poll.get());
  console.log(results);
  for(var i=0;i<results.length;i++){
    poll.addChoice(results[i]);
  }
  res.redirect("/poll/"+ poll.id);
});
});
}

CollabInt.prototype.getPoll= function(pollId, res){
	var data=[];
	var inner=[];
	db.poll.findById(pollId).then(function(poll){
		db.choice.findAll({where:{
			pollId : pollId
		},  order: "id ASC" }).then(function(choice, created){
			data.push(poll);
			choice.forEach(function(g){
			console.log(g.choiceString, g.value);
			inner.push(g.choiceString, g.value);
			});
			data.push(inner);
			res.render("poll",{data: data});
		});
	});
}

CollabInt.prototype.closePoll = function(pollId, callback){
	var data = [];
	var inner = [];
	db.poll.findById(pollId).then(function(poll){
		poll.active = false;
		poll.save();
	db.choice.findAll({where:{
		pollId: pollId
	}}).then(function(choices){
		inner.push(poll.category,poll.question);
		data.push(inner);
		choices.forEach(function(choice){
			inner = [];
			inner.push(choice.choiceString, choice.value);
			data.push(inner);
		});
		callback.storeData(data);
	});

	});
}

CollabInt.prototype.updatePoll = function(data){
	var values = data.split(",");
	var pollId = values[0];
	var value  = values[1];
	var choice = values[2].replace(/\t/g, '').replace(/\n/g, '');

	db.choice.find({where:{
		pollId: pollId,
		choiceString: choice
	}}).then(function(choice){
		console.log(choice.value);
		choice.value++;
		choice.save();		

		console.log(choice.value);
		// choice.dataValues.value +=1;
	});


}


// test(category, question, true);
// var c = new CollabInt();
// c.storeData(data);
// c.addPoll(category, question, choices, true);
// c.closePoll(2, c);
// setTimeout(function(){console.log(friendObjG.friend[0].name);}, 3000);
 
module.exports = CollabInt;

