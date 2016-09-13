Accounts.onCreateUser(function(options, user) {

  user["works"] = {};
  user["goal"] = null;
  user["nextUnit"] = null;

  if (options.profile) {
    user.profile = options.profile;
  };

  // set user states for all concepts at zero
  reset_user(user._id);

  // assume user knows all currently available languages
  var availableLanguages = Nodes.find({
    isLanguage: true
  }).fetch();
  var availableLanguagesAsKnownConceptBag = {};
  for (index in availableLanguages) {
    availableLanguagesAsKnownConceptBag[availableLanguages[index]['_id']] = 1;
  };

  Meteor.call("changeStates", availableLanguagesAsKnownConceptBag, user._id, function(error, result) {
    if (error) {
      console.log("error", error);
    }
  });
  
  return user;
});
