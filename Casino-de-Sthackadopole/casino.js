//MD5
var md5 = require('MD5');
var prefix = "PREFIX";
var suffix = "SUFFIX";
//Date
var jsDate=require("js-date");
//Express
var express = require('express');
var session = require('express-session');
//Security
var helmet = require('helmet');

var app= express();

app.use(session({
                secret: 'thisisadamnsecret',
                name: 'myApp'
        }));
app.use(helmet());

var random = require('seed-random');
var moment = require('moment');

//Body Parser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname+'/public'));

//Async
var async = require("async");
//Redis
var redis = require("redis");
var redisHost  = process.env.REDIS_PORT_6379_TCP_ADDR;
var redisPort  = process.env.REDIS_PORT_6379_TCP_PORT;

client=redis.createClient(redisPort,redisHost);
banque = redis.createClient(redisPort,redisHost);
challenges = redis.createClient(redisPort,redisHost);

banque.select(1);
challenges.select(2);
 
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('database.sqlite');
var questions = new sqlite3.Database('questions.sqlite');


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getJetons(username){
	banque.get(username,function(err,reply){
		return parseInt(reply);
	});
}

var isAuthenticated = function (req, res, next) {
  if (req.session.username)
    return next();
  res.redirect('/');
}

var hasEnoughJetons = function (req,res,next){
	async.waterfall([
		function(callback){
			banque.get(req.session.username,function(err,reply){
				callback(parseInt(reply));
			});
		}],
		function(jetons){
			if(jetons>0){
				return next();
			}else{
				res.end('Pas assez de jetons! ');
			}
		});
}

var hasThousandJetons = function (req,res,next){
	async.waterfall([
		function(callback){
			banque.get(req.session.username,function(err,reply){
				callback(parseInt(reply));
			});
		}],
		function(jetons){
			if(jetons>=1000){
				return next();
			}else{
				res.end(JSON.stringify({result:2,string:"Vous n'avez pas assez de jetons pour etre ici !"}));
			}
		});
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

app.get('/',function(req,res){
	if(req.session.username){
		res.redirect('/game');
	}else{
		res.render('register.ejs');
	}
});

app.post('/register',function(req,res){
	var username = md5(req.body.username);
	var password = req.body.password;

	client.get(username,function(err,reply){
		if(reply){
			res.render('register.ejs',{message:"Quelqu'un a déjà pris ce pseudo choissez en un autre :)"});
		}else{
			client.set(username,md5(password),function(er,rep){
				if(!er){
					banque.set(username,0,function(e,r){
						if(!e){
							challenges.set(username,JSON.stringify(shuffle([1,2,3,4,5,6,7,8,9,10])),function(f,s){
								if(!f){
									res.render('register.ejs',{message:"Vous pouvez vous logger !"});
								}else{
									res.render('register.ejs',{message:"Il y a encore un canartichaud dans la soupe .. Signalez ce bug à un Admin, cela ne fait pas partit du jeu :"});
								}
							});
						}else{
							res.render('register.ejs',{message:"Il y a encore un canartichaud dans la soupe .. Signalez ce bug à un Admin, cela ne fait pas partit du jeu :"});
						}
					});
				}else{
					res.render('register.ejs',{message:"Il y a encore un canartichaud dans la soupe .. Signalez ce bug à un Admin, cela ne fait pas partit du jeu :"});
				}
			});
		}
	});
});

app.post('/login',function(req,res){
	var username = md5(req.body.username);
	var password = req.body.password;

	client.get(username,function(err,reply){
		if(md5(password) == reply){
			challenges.get(username,function(error,response){
				
				if(response){
					req.session.challenge = JSON.parse(response);
					req.session.username= username;
					res.redirect('/game');
				}
				else{
					res.render('register.ejs',{message:"Il y a encore un canartichaud dans la soupe .. Signalez ce bug à un Admin, cela ne fait pas partit du jeu :"});
				}
			});
		
		}else{
			res.render('register.ejs',{message:"Mauvais mot de passe"});
		}
	});
});

app.get('/game',isAuthenticated,function(req,res){
	console.log(req.session.challenge);
	banque.get(req.session.username,function(err,reply){
		res.render('game.ejs',{jetons:parseInt(reply)});
	});
	
});

app.get('/api/jetons',isAuthenticated,function(req,res){
	async.waterfall([
		function(callback){
			banque.get(req.session.username,function(err,reply){
				callback(parseInt(reply));
			});
		}],
		function(jetons){
			res.end(jetons.toString());
		});	
});

app.get('/api/:html?/challenge',isAuthenticated,function(req,res){
	if(req.session.challenge.length>0){
		questions.get('SELECT id,question,r1,r2,r3,r4 from questions where id = ?',req.session.challenge[0],function(e,r){
			if(req.params.html){
				res.render('deskPopup.ejs',{question:r.question,re1:r.r1,re2:r.r2,re3:r.r3,re4:r.r4,qu:r.id});
			}else{
				res.end(JSON.stringify({question:r.question,re1:r.r1,re2:r.r2,re3:r.r3,re4:r.r4,qu:r.id}));
			}
		});
	}else{
		if(req.params.html){
			res.render('noMoreQuestion.ejs');
		}else{
			res.end("Nous n'avons plus de questions pour vous !");
		}
	}	
});

app.post('/api/challenge',isAuthenticated,function(req,res){
	var question = parseInt(req.body.question);
	var reponse = parseInt(req.body.reponse);

	if(req.session.challenge.length>0 && question==req.session.challenge[0]){
		req.session.challenge.splice(0,1);
		challenges.set(req.session.username,JSON.stringify(req.session.challenge));

		questions.get('SELECT bonne_reponse from questions where id=?',question,function(e,r){
			if(parseInt(r.bonne_reponse)==reponse){
				banque.incrby(req.session.username,1,function(er,re){
					res.end(JSON.stringify({resultat:1,string:"Bonne réponse !"}));
				});
			}else{
				res.end(JSON.stringify({resultat:0,string:"Mauvaise réponse !"}));
			}
		});
	}else{
		if(req.session.challenge.length>0){
			res.end(JSON.stringify({resultat:0,string:'Dis Donc ! On ne hack pas le jeu !'}));
		}else{
			res.end(JSON.stringify({resultat:0,string:'Vous ne pouvez plus répondre à des questions !'}));
		}
	}
});

app.get('/api/:html?/computer',isAuthenticated,function(req,res){
	if(req.params.html){
		res.render('computer.ejs')
	}else{
		res.end('Not Implemented');
	}
});

app.get('/api/:html?/roulette',isAuthenticated,function(req,res){
	if(req.params.html){
		res.render('roulettePopup.ejs')
	}else{
		res.end('Not Implemented');
	}
});

app.get('/api/roulette/launch',isAuthenticated,hasEnoughJetons,function(req,res){
	var changeJetons = 0;
	async.waterfall([
		function(callback){
            banque.decr(req.session.username,function(err,rep){
                callback(null);
            });
        },
        function(callback) {
            var rand = random(moment.utc().seconds());
            var a = Math.floor(rand() * (6 - 1)) + 1;
            var b = Math.floor(rand() * (6 - 1)) + 1;
            var c = Math.floor(rand() * (6 - 1)) + 1;
            callback(null, a,b,c);
        },
        function(arg1,arg2,arg3,callback){
           
            if(arg1==arg2 && arg1==arg3){
				switch(arg1){
					case 1:
						changeJetons =1;
						callback(null,arg1,arg2,arg3,'1');

					case 2:
						changeJetons=10;
						callback(null,arg1,arg2,arg3,'10');
					break;
					case 3:
						changeJetons=20;
						callback(null,arg1,arg2,arg3,'20');
					break;
					case 4:
						changeJetons=50;
						callback(null,arg1,arg2,arg3,'50');
					break;
					case 5:
						changeJetons=100;
						callback(null,arg1,arg2,arg3,'100');
					break;
					default:
						callback(null,arg1,arg2,arg3,'error');
					break;
				}

			}
			else if(arg1==1 || arg3==1 || arg2==1){
				changeJetons=-10;
				callback(null,arg1,arg2,arg3,'-10');
			}
			else{
				callback(null,arg1,arg2,arg3,'0');
			}
		}
	], function (err,arg1,arg2,arg3,gains) {
		if(parseInt(changeJetons)!=0){
			banque.incrby(req.session.username,parseInt(changeJetons),function(e,r){
				res.end(JSON.stringify({r1:arg1,r2:arg2,r3:arg3,result:gains}));
			});
		}else{
			res.end(JSON.stringify({r1:arg1,r2:arg2,r3:arg3,result:gains}));
		}
	});
});

app.post('/api/:html?/computer/login',isAuthenticated,function(req,res){
	str = "FIND ME !";

	db.get(str,function(err,row){
		if(row.password==req.body.password){
			res.end(JSON.stringify({result:0,string:"Felicitation vous avez le Flag !"}));
		}else{
			res.end(JSON.stringify({result:1,string:"Mauvais mot de passe"}));
		}
	});
});

app.get('/api/:html?/shop',isAuthenticated,function(req,res){
	res.render('shop.ejs');
});


app.post('/api/:html?/shop',isAuthenticated,hasThousandJetons,function(req,res){
	str = "SELECT description from articles WHERE id ='"+req.body.ellement+"'";
	console.log(req.body.ellement);
	db.get(str,function(err,row){
		console.log(err);
		console.log(row);
		if(row){
			banque.incrby(req.session.username,-1000,function(e,r){
				res.end(JSON.stringify({result:0,string:'Pokéball ajoutée à votre sac !'}));
			});
		}else{
			res.end(JSON.stringify({result:1,string:"Plus assez de Pokéballs dans le stock !"}))
		}
	});
});


var server= app.listen(3000,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server Started");
});

