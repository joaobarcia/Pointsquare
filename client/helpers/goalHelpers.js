Template.registerHelper('goalExists', function() {
  if (typeof Goals.findOne({
      user: Meteor.userId()
    }) !== "undefined") {
    return 1;
  } else return 0;

});

Template.registerHelper('goalName', function() {
  var goal = Goals.findOne({
    user: Meteor.userId()
  });
  return Nodes.findOne(goal.node).name;
});

Template.registerHelper('goalConceptCount', function() {
  var goal = Goals.findOne({
    user: Meteor.userId()
  });
  return goal.conceptCount;
});

// workaround because Mongo does not accept sorted find({_id: { $in: unitIds}})
Template.registerHelper('TEMP_goalUnitsIds', function() {
  var goal = Goals.findOne({
    user: Meteor.userId()
  });
  var unitIds = goal.units;
  return unitIds;
  // return Nodes.find({
  //   _id: {
  //     $in: unitIds
  //   }
  // });
});

Template.registerHelper('goalIsCompleted', function() {
  // if user has a goal
  if (typeof Goals.findOne({
      user: Meteor.userId()
    }) !== 'undefined') {
    var goal = Goals.findOne({
      user: Meteor.userId()
    });
    // if that goal has a defined state
    if (typeof Personal.findOne({
        node: goal.node,
        user: Meteor.userId()
      }) !== 'undefined') {
      var goalInfo = Personal.findOne({
        node: goal.node,
        user: Meteor.userId()
      });
      var goalState = goalInfo.state;
      //if the goal is higher than 0.9
      var goalCompleted = goalState > 0.9;
      if (goalCompleted) {
        Session.set('removeGoalOnDestroyGoalPage', true);
        return true;
      } else return false;
    } else return false;
  } else return false;
});
