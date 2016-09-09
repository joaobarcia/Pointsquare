Template.setGoalButton.events({
  'click .set-goal': function(event, template) {
    event.preventDefault();
    var nodeId = template.data._id;
    Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
      if (!r) {
        Materialize.toast('Unfortunately there is no content to reach this goal yet', 3000)
        $(this).prop('disabled', true);
        //Meteor.call('removeGoal', Meteor.userId());
      }
    });
  },
  'click .start-learning': function(event, template) {
    event.preventDefault();
    var nodeId = template.data._id;
    Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
      if (r) {
        FlowRouter.go('/content/' + r);
      } else {
        Session.set("noOptionsFound", nodeId);
        //Meteor.call('removeGoal', Meteor.userId());
      }
    });
  }
});
