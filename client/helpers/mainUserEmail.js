Template.registerHelper('mainUserEmail', function() {
  return Meteor.user().emails[0].address;
});
