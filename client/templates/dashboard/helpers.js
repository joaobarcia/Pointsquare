Template.dashboard.helpers({
  userKnowsLanguage: function(languageId) {
    var knownLanguagesIds = _.map(Blaze._globalHelpers.knownLanguages(), "_id");
    if (_.includes(knownLanguagesIds, languageId)) {
      return "checked"
    }
    else return "false"
  }
});
