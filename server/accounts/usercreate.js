Accounts.onCreateUser( function(options, user) {

	user["works"] = {};
	user["goal"] = null;
	user["nextUnit"] = null;

  	if (options.profile)
    	user.profile = options.profile;

  	reset_user(user._id);

  	return user;

});
