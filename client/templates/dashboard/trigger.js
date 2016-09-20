Template.dashboard.rendered = function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      var availableLanguages = Blaze._globalHelpers.availableLanguages();
      var knownLanguagesAsBag = {};
      for (index in availableLanguages) {
        knownLanguagesAsBag[availableLanguages[index]['_id']] = 0;
      };
      var knownLanguagesIds = _.map(Blaze._globalHelpers.knownLanguages(), "_id");
      for (index in knownLanguagesIds) {
        knownLanguagesAsBag[knownLanguagesIds[index]] = 1;
      };
      Session.set('knownLanguagesAsBag', knownLanguagesAsBag);
      //Session.set('knownLanguagesChanges', deletedNeedsSets);
    }
  });
};


Template.dashboard.events({
  'click #resetUserKnowledge': function(event) {
    event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('resetUser', userId);
  },
  'change .languageCheckbox': function(event, template) {
    event.preventDefault();
    //WARNING: LATER MAKE SUBMIT BUTTON ONLY DISPLAY IF CHANGES HAVE OCCURED
    var knownLanguagesAsBag = Session.get('knownLanguagesAsBag');
    var checkboxIsOn = event.currentTarget.checked;
    var languageId = event.currentTarget.id
    if (checkboxIsOn) {
      knownLanguagesAsBag[languageId] = 1
    } else {
      knownLanguagesAsBag[languageId] = 0
    }

    var userId = Meteor.userId();
    Meteor.call("changeKnownLanguages", knownLanguagesAsBag, userId, function(error, result) {
      if (error) {
        console.log("error", error);
      }
    });
    Session.set('knownLanguagesAsBag', knownLanguagesAsBag);
  },
  'click #submitKnownLanguages': function(event) {
    event.preventDefault();
  },
});
