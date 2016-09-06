Template.goalBar.events({
    "click .next-unit": function(event, template) {
        event.preventDefault();
        var triedUnits = Session.get("triedUnits") || {};
        var currentNextUnit = Meteor.user().nextUnit;
        var goal = Meteor.user().goal;
        Meteor.call("setGoal", goal, Meteor.userId(), triedUnits, function(e, r) {
            if( r ){
              triedUnits[r] = true;
              Session.set("triedUnits",triedUnits);
              FlowRouter.go('/content/' +r);
            }
            else{ console.log("No options found!"); }
            Session.set('isLoading', false);
        });
    }
});
