Template.goalPage.helpers({

  name: function() {
    var goal = Goals.findOne({user: Meteor.userId()});
    return Nodes.findOne(goal.node).name;
  },

  conceptCount: function() {
    var goal = Goals.findOne({user: Meteor.userId()});
    return goal.conceptCount;
  },

  units: function() {
    var goal = Goals.findOne({user: Meteor.userId()});
    var unitIds = goal.units;
    return Nodes.find({ _id: {$in:unitIds} });
  }

});
