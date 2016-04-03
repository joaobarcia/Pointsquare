Template.dashboard.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('nodes');
        self.subscribe('personal');
        self.subscribe('goals');
    });
});

Template.dashboard.events({
  'click #resetUserKnowledge': function(event) {
    event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('resetUser', userId);
  }
});
