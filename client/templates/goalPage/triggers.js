Template.goalPage.onCreated(function() {
    Session.set("isLoading", true);
    var self = this;
    self.autorun(function() {
        self.subscribe('nodes');
        self.subscribe('personal');
        self.subscribe('goals');
    });
    // if a goal exists
    if (typeof Goals.findOne({
            user: Meteor.userId()
        }) !== "undefined") {

        var goal = Goals.findOne({
            user: Meteor.userId()
        });
        // re-calculate it
        Meteor.call("setGoal", goal.node, Meteor.userId(), function(e, r) {
            Session.set("isLoading", false);
        });
    } else {
        Session.set("isLoading", false);
    }
});

Template.goalPage.events({
    'click #removeGoal': function(event) {
        event.preventDefault();
        var userId = Meteor.userId();
        var goalId = Goals.findOne({
            user: Meteor.userId()
        }).node;
        Meteor.call('removeGoal', goalId, userId);
    }
});

Template.goalPage.onDestroyed(function() {
    if (Session.equals('removeGoalOnDestroyGoalPage', true)) {
        Session.set('removeGoalOnDestroyGoalPage', false);
        var userId = Meteor.userId();
        var goalId = Goals.findOne({
            user: Meteor.userId()
        }).node;
        console.log('removed goal!');
        Meteor.call('removeGoal', goalId, userId);
    }
});
