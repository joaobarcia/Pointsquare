Template.dashboard.events({
  'click #resetUserKnowledge': function(event) {
    event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('resetUser', userId);
  }
});
