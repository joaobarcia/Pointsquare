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

Template.registerHelper('goalUnits', function() {
  var goal = Goals.findOne({
    user: Meteor.userId()
  });
  var unitIds = goal.units;
  return Nodes.find({
    _id: {
      $in: unitIds
    }
  });
});
