Template.registerHelper('goalExists', function() {
  var goal = Meteor.user().goal;
  if (typeof goal !== "undefined") {
    return 1;
  } else return 0;

});

Template.registerHelper("goalIsNot", function(id){
  var goal = Meteor.user().goal;
  return id != goal;
});

Template.registerHelper('goalName', function() {
  var goal = Meteor.user().goal;
  return Nodes.findOne(goal).name;
});

Template.registerHelper('goalIsCompleted', function() {
  var goalId = Meteor.user().goal;
  // if user has a goal
  if (typeof goalId !== 'undefined') {
    var goal = Nodes.findOne(goalId);
    // if that goal has a defined state
    if (typeof goal !== 'undefined') {
      var stateInfo = Personal.findOne({
        node: goalId,
        user: Meteor.userId()
      });
      var goalState = stateInfo.state;
      //if the goal is higher than 0.9
      var goalCompleted = goalState > 0.9;
      if (goalCompleted) {
        Session.set('removeGoalOnDestroyGoalPage', true);
        return true;
      } else return false;
    } else return false;
  } else return false;
});
