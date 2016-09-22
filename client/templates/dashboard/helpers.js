Template.dashboard.helpers({
  userKnowsLanguage: function(languageId) {
    const knownLanguagesIds = _.map(Blaze._globalHelpers.knownLanguages(), "_id");
    if (_.includes(knownLanguagesIds, languageId)) {
      return "checked"
    } else return "false"
  },
  dashboardOptionIs: function(option) {
    const dashboardOption = Session.get('dashboardOption');
    return dashboardOption == option;
  },
  noLanguageSelected: function() {
    const numberOfKnownLanguages = Blaze._globalHelpers.knownLanguages().length;
    // console.log(numberOfKnownLanguages);
    if (numberOfKnownLanguages == 0) {
      return true;
    } else return false;
  }
});
