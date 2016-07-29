//Bring in uuid generator
var uuid = require('node-uuid');
//Bring in Bcrypt 
var bcrypt = require('bcryptjs');
//set up bcrypt salt for password encryption
var salt = bcrypt.genSaltSync(10);
//Bring in User model
var User = require('./app/models/User');
//Build error messages
var errorHandler = require('./errorHandler');

module.exports = function(router){
	//API for Users
	router.route('/user')
		//Add user
		.post(function(req, res) {
			//Check that Username and Password are included
	        if(req.body.username && req.body.passHash){
	        	//Check to see if Username already exists
	        	User.find({ username: req.body.username }, function(err, users){
			    	if (err){
			    		res.send(err);
			    	}
			    	//Username found in database
			    	else if(users.length > 0){
						res.send({message: 'This username is already taken. Please try a different username.'});
					}else{
						//Create user
						var user = new User();
				        user.username = req.body.username;

				        //Encrypt password before saving
						var hash = bcrypt.hashSync(req.body.passHash, salt);
				        user.passHash = hash;

				        //Generate uuid for token
				        user.currToken = uuid.v1();

				        //Save the user
				        user.save(function(err) {
				            if (err){
				                res.send(err);
				            }
				            //Return user's token
				            res.json({ token: user.currToken });
				        });
					}
		    	});
		    }
		    //Username and/or password were missing, return error
		    else{
		    	res.json(errorHandler.notEnoughInfoToCreateErrorMessage('username and password'));
		    }
	    })

	    //Crappy get user API, I believe that this can be deleted prior to release
	    .get(function(req, res) {
	    	var object = {};
	    	if(req.headers.username || req.headers.currtoken){
		    	if(req.headers.username !== undefined){
		    		object.username = req.headers.username;
		    	}else if(req.headers.currtoken !== undefined){
		    		object.currToken = req.headers.currtoken;
		    	}
				User.find(object, function(err, users) {
					if (err)
						res.send(err);
					if (users.length === 0){
						res.json(errorHandler.userNotFoundErrorMessage);
					}else if(users.length > 1){
						res.json(errorHandler.moreThanOneUserFoundErrorMessage);
					}else{
						res.json(users[0]);
					}
				});
			}
			User.find(object, function(err, users) {
				if (err)
					res.send(err);
				res.json(users);
			});
		})
		//Delete User
		.delete(function(req, res) {
			//Search for user by username
			User.find({ username: req.headers.username}, function(err, users){
				//Check for user errors
		    	if (errorHandler.userErrorCheck(res, err, users)){
		    		//Compare Hashed password to saved password
					if(bcrypt.compareSync(req.headers.passhash, users[0].passHash)){
						//remove User
				        User.remove({ username: users[0].username }, function(err, user) {
				            if (err){
				                res.send(err);
				            }

				            //Remove all Ingredients associated with the User
					        Ingredient.remove({
					            user: users[0].username
					        }, function(err, user) {
					            if (err){
					                res.send(err);
					            }
					            res.json(errorHandler.deleteSuccessfulMessage);
					        });
				        });
				    }else{
				    	res.json({message: 'Incorrect password.'});
				    }
				}
			});
	    })
	;
	router.route('/user/login')
		.put(function(req, res) {
			//Find User based on token and username
			User.find({ username: req.headers.username }, function(err, users){
				//Check for user errors
		    	if (errorHandler.userErrorCheck(res, err, users)){
		    		if(bcrypt.compareSync(req.headers.passhash, users[0].passHash)){
		    			users[0].currToken = uuid.v1();
		    			users[0].save(function(err) {
				            if (err){
				                res.send(err);
				            }
				            //Return user's token
				            res.json({ token: users[0].currToken });
				        });
		    		}else{
		    			res.json({message: 'Incorrect password.'});
		    		}
        		}
        	});
		})
	;
	router.route('/user/password')
		.put(function(req, res) {
			//Find User based on token and username
			User.find({ username: req.headers.username }, function(err, users){
				//Check for user errors
		    	if (errorHandler.userErrorCheck(res, err, users)){
		    		if(bcrypt.compareSync(req.headers.passhash, users[0].passHash)){
		    			var hash = bcrypt.hashSync(req.body.passHash, salt);
				        users[0].passHash = hash;
				        users[0].currToken = uuid.v1()
		    			users[0].save(function(err) {
				            if (err){
				                res.send(err);
				            }
				            //Return user's token
				            res.json({ token: users[0].currToken });
				        });
		    		}else{
		    			res.json({message: 'Incorrect password.'});
		    		}
        		}
        	});
		})
	;
}