Template.dashboard.helpers({
  userKnowsThisLanguage: function() {
    console.log(Blaze._globalHelpers.knownLanguages());
    console.log(Blaze._globalHelpers.availableLanguages());
    console.log(Template.parentData());
  }
});
