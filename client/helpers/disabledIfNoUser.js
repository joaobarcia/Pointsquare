Template.registerHelper('disabledIfNoUser', function() {
  if (!Meteor.user()) {
    return 'disabled'
  }
});
