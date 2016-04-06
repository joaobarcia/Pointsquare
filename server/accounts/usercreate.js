Accounts.onCreateUser( function(options, user) {
	
	user["works"] = {};

  	if (options.profile)
    	user.profile = options.profile;

  	reset_user(user._id);

  	return user;
	
});
