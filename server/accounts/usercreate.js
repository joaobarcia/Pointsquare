Accounts.onCreateUser( function(options, user) {
	
	user["works"] = {};

  	if (options.profile)
    	user.profile = options.profile;

  	return user;
	
});
