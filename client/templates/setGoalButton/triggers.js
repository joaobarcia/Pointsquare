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
      //Materialize.toast('Unfortunately there is no content to reach this goal yet', 3000)
      console.log("NO CONTENT YET");
      $(this).prop('disabled', true);
    }
  },
  'click .start-learning': function(event, template) {
    event.preventDefault();
    const nodeId = template.data._id;
    const nextUnitId = Meteor.user().nextUnit;
    if (typeof nextUnitId !== 'undefined' && nextUnitId !== null) {
      FlowRouter.go('/content/' + nextUnitId);
    } else {
      Session.set("noOptionsFound", nodeId);
    }
  }
});
