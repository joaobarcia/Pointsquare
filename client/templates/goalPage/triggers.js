Template.goalPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('nodes');
    self.subscribe('personal');
    self.subscribe('goals');
  });
});

Template.goalPage.events({
  'click #removeGoal': function(event) {
    event.preventDefault();
    var userId = Meteor.userId();
    var goalId = Goals.findOne({
      user: Meteor.userId()
    }).node;
    Meteor.call('removeGoal', goalId, userId);
  }
});
