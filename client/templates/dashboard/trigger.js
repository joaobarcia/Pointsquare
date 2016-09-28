Template.dashboard.rendered = function() {
  this.autorun(() => {
      if (this.subscriptionsReady()) {
        // console.log('language bag')
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
    }),

    // update sticky menu when right column changes
    this.autorun(() => {
      if (this.subscriptionsReady()) {
        // console.log('sticky');
        const dashboardOption = Session.get('dashboardOption');
        setTimeout(function() {
          $('.ui.sticky')
            .sticky({
              offset: 70,
              context: '#context'
            });
        }, 500);
      }
    }),
    Tracker.autorun(function() {
      $('[data-tooltip]').popup();
      $('.ui.checkbox').checkbox();
    }),
    Session.set('dashboardOption', 'settings');
};


Template.dashboard.events({
  'click #dashboard-menu .item': function(event, template) {
    $(event.target).addClass('active');
    $('#dashboard-menu .item').not($(event.target)).removeClass('active');
    $("html, body").animate({
      scrollTop: 0
    });
    //$('#search-menu .item').not(this).removeClass('active');
    //$(this).addClass('active');
  },
  'click #settings': function(event) {
    Session.set('dashboardOption', 'settings');
  },
  'click #knowledge': function(event) {
    Session.set('dashboardOption', 'knowledge');
  },
  'click #contributions': function(event) {
    Session.set('dashboardOption', 'contributions');
  },
  'click #resetUserKnowledge': function(event) {
    event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('resetUser', userId);
  },
  'keyup input[name="username"]': function(event, template) {
    $('#submit-settings').removeClass('disabled');
  },
  'change .languageCheckbox': function(event, template) {
    event.preventDefault();
    $('#submit-settings').removeClass('disabled');

    var knownLanguagesAsBag = Session.get('knownLanguagesAsBag');
    var checkboxIsOn = event.currentTarget.checked;
    var languageId = event.currentTarget.id;
    if (checkboxIsOn) {
      knownLanguagesAsBag[languageId] = 1
    } else {
      knownLanguagesAsBag[languageId] = 0
    }
    Session.set('knownLanguagesAsBag', knownLanguagesAsBag);
  },
  'submit form[name="user-settings"]': function(event, template) {
    event.preventDefault();

    // username changes
    const newUserName = event.currentTarget.elements['username'].value;
    Meteor.call('setUserName', newUserName);
    $('#submit-settings').addClass('disabled');

    // known languages changes
    const userId = Meteor.userId();
    const knownLanguagesAsBag = Session.get('knownLanguagesAsBag');
    Meteor.call("changeKnownLanguages", knownLanguagesAsBag, userId, function(error, result) {
      if (error) {
        console.log("error", error);
      }
    });
  },
});
