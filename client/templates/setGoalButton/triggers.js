Template.setGoalButton.events({
  'click .set-goal': function(event, template) {
    console.log('click .set-goal');
    event.preventDefault();
    var nodeId = template.data._id;
    var goal = {}; goal[nodeId] = true;
    var unit = Meteor.globalFunctions.findUsefulContent(goal);
    if (unit) {
      Meteor.call("setGoal", nodeId, unit, Meteor.userId());
    }
    else{
      Materialize.toast('Unfortunately there is no content to reach this goal yet', 3000)
      $(this).prop('disabled', true);
    }
  },
  'click .start-learning': function(event, template) {
    console.log('click .start-learning');
    event.preventDefault();
    var nodeId = template.data._id;
    var unit = Meteor.user().nextUnit;
    if (unit) {
      FlowRouter.go('/content/' + unit);
    } else {
      Session.set("noOptionsFound", nodeId);
    }
  }
});
