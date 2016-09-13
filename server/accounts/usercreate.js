Accounts.onCreateUser(function(options, user) {

  user["works"] = {};
  user["goal"] = null;
  user["nextUnit"] = null;
  // Assume user knows all currently available languages
  user["languagesUserKnows"] = _.map(Nodes.find({
    isLanguageConcept: true
  }).fetch(), "_id");

  console.log(user);
  console.log(options);

  if (options.profile) {
    user.profile = options.profile;
  };
	reset_user(user._id);

	console.log(user);
  return user;
});
