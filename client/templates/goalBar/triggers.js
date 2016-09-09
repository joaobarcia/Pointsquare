Template.goalBar.events({
  "click .next-unit": function(event, template) {
    event.preventDefault();
    var triedUnits = Session.get("triedUnits") || {};
    var currentNextUnit = Meteor.user().nextUnit;
    var goal = Meteor.user().goal;
    Meteor.call("setGoal", goal, Meteor.userId(), triedUnits, function(e, r) {
      if (r) {
        triedUnits[r] = true;
        Session.set("triedUnits", triedUnits);
        Session.set('isLoading', false);
        FlowRouter.go('/content/' + r);
      } else {
        triedUnits = {};
        Meteor.call("setGoal", goal, Meteor.userId(), triedUnits, function(e2, r2) {
          if (r2) {
            triedUnits[r2] = true;
            Session.set("triedUnits", triedUnits);
            Session.set('isLoading', false);
            FlowRouter.go('/content/' + r2);
          } else {
            console.log("No options found!");
          }
        });
      }
    });
  },
  "click #remove_goal": function(event, template) {
    event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('removeGoal', userId);
  }
});
