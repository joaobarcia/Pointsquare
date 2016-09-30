Meteor.startup(function() {
  $('body').on('click', '[data-action=logout]', function(event) {
    event.preventDefault();
    AccountsTemplates.logout();
  });

  if (Meteor.isDevelopment) {
    Session.set("godMode", true);
  } else if (Meteor.isProduction) {
    Session.set("godMode", false);
  };
  Meteor.call("readyThreshold", function(e, r) {
    Session.set("readyThreshold", r);
  });
});
