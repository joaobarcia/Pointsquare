Template.registerHelper('goalExists', function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    return Meteor.user().goal != null;
  };
});

Template.registerHelper("thisIsGoal", function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    var goal = Meteor.user().goal;
    var thisNodeId = this._id;
    return thisNodeId == goal;
  }
});

Template.registerHelper('goalId', function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    var goal = Meteor.user().goal;
    return Nodes.findOne(goal)._id;
  }
});

Template.registerHelper('goalName', function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    var goal = Meteor.user().goal;
    return Nodes.findOne(goal).name;
  }
});

Template.registerHelper('goalType', function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    var goal = Meteor.user().goal;
    return Nodes.findOne(goal).type;
  }
});

Template.registerHelper("noOptionsFound", function(id) {
  return Meteor.user().goal != null && Meteor.user().nextUnit == null;
});

Template.registerHelper('goalIsCompleted', function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    var goalId = Meteor.user().goal;
    // if user has a goal
    if (goalId) {
      var goal = Nodes.findOne(goalId);
      // if that goal has a defined state
      if (goal) {
        // if meteor has already loaded user info
        if (typeof Personal.findOne({
            node: goalId,
            user: Meteor.userId()
          }) !== 'undefined') {
          var stateInfo = Personal.findOne({
            node: goalId,
            user: Meteor.userId()
          });
          var goalState = stateInfo.state;
          //if the goal is higher than Session.get("ready threshold")
          var goalCompleted = goalState > Session.get("ready threshold");
          if (goalCompleted) {
            Session.set('removeGoalOnDestroyGoalPage', true);
            return true;
          } else return false;
        } else return false;
      } else return false;
    } else return false;
  }
});
