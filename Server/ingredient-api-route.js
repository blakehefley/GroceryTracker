//Bring in Ingredient Model
var Ingredient = require('./app/models/Ingredient');
//Bring in User model
var User = require('./app/models/User');
//Build error messages
var errorHandler = require('./errorHandler');

module.exports = function(router){
	//API for ingredients
	router.route('/ingredients')
		//Add Ingredient to User's Ingredient List
		.post(function(req, res) {
			if(req.body.name){
				//Create Ingredient
		        var ingredient = new Ingredient();
		        ingredient.name = req.body.name;
		        //Find User based on token and username
		        User.find({ currToken: req.headers.currtoken, username: req.headers.username }, function(err, users){
		        	//Check for user errors
			    	if (errorHandler.userErrorCheck(res, err, users)){
			    		//Add user to Ingredient
						ingredient.user = users[0].username; 
						//Save Ingredient
						ingredient.save(function(err) {
				            if (err){
				                res.send(err);
				            }
				            res.json(ingredient.name + ' saved successfully!');
				        });
					}
		    	});
		    }
		    //If no ingredient name is passed in return error
		    else{
		    	res.json(errorHandler.notEnoughInfoToCreateErrorMessage('ingredient name'));
		    }
	    })
		.get(function(req, res) {
			//Find User based on token and username
			User.find({ currToken: req.headers.currtoken, username: req.headers.username  }, function(err, users){
				//Check for user errors
		    	if (errorHandler.userErrorCheck(res, err, users)){
		    		//Find all ingredients for the user found
					Ingredient.find({ user: users[0].username}, function(err, ingredients) {
						if (err){
							res.send(err);
						}
						res.json(ingredients);
					});
				}
	    	});
		})
		//API to delete Ingredient
		.delete(function(req, res) {
			//Find User based on token and username
			User.find({ currToken: req.headers.currtoken, username: req.headers.username  }, function(err, users){
				//Check for user errors
		    	if (errorHandler.userErrorCheck(res, err, users)){
		    		//Remove ingredient by id for given user
					Ingredient.remove({
						user: users[0].username,
			            _id: req.body.ingredient_id
			        }, function(err, ingredient) {
			            if (err){
			                res.send(err);
			            }
			            res.json(errorHandler.deleteSuccessfulMessage);
			        });
				}
	    	});
	    })
		//API to update Ingredient
	    .put(function(req, res) {
			//Find User based on token and username
			User.find({ currToken: req.headers.currtoken, username: req.headers.username  }, function(err, users){
				//Check for user errors
		    	if (errorHandler.userErrorCheck(res, err, users)){
		    		//Find ingredient
        			Ingredient.findById(req.body.ingredient_id, function(err, ingredient) {
        				if (err){
			                res.send(err);
			            }
			            else if(ingredient.user !== req.headers.username){
			            	res.send('Incorrect username or Ingredient Identifier.');
			            }else{
	        				var oldName = ingredient.name;
	        				ingredient.name = req.body.name;
	        				ingredient.save(function(err) {
				                if (err)
				                    res.send(err);

				                res.json({ message: oldName + ' updated to ' + ingredient.name + '!' });
				            });
	        			}
			        });
        		}
        	});
		})
	;
	//Admin API for checking all ingredients regardless of user
	//TODO: Remove this functionality prior to release
	router.route('/ingredients/all')
		.delete(function(req, res) {
			//Remove all ingredients
	        Ingredient.remove({ }, function(err, ingredient) {
	            if (err){
	                res.send(err);
	            }
	            res.json(errorHandler.deleteSuccessfulMessage);
	        });
	    })
	    .get(function(req, res) {
	    	//Get all ingredients
	    	Ingredient.find({}, function(err, ingredients) {
				if (err){
					res.send(err);
				}
				res.json(ingredients);
			})
	    })
	;
}