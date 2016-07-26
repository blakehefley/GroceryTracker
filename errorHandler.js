var errorHandler = {}
//Define common response messages
errorHandler.userNotFoundErrorMessage = {message: 'User not found. Please log out and log back in.'};
errorHandler.moreThanOneUserFoundErrorMessage = {message: 'More than one matching user found. Please log out and log back in.'};
errorHandler.deleteSuccessfulMessage = { message: 'Successfully deleted' };
errorHandler.notEnoughInfoToCreateErrorMessage = function(fields){
	return { message: 'You failed to provide enough information. Please provide ' + fields + '.'};
};

//Define a common user error check function
errorHandler.userErrorCheck = function(res, err, users){
	if (err){
		res.send(err);
		return false;
	}else if (users.length === 0){
		res.send(errorHandler.userNotFoundErrorMessage);
		return false;
	}else if(users.length > 1){
		res.send(errorHandler.moreThanOneUserFoundErrorMessage);
		return false;
	}return true;
}

module.exports =  errorHandler;