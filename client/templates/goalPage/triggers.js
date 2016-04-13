Template.goalPage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('nodes');
        self.subscribe('personal');
        self.subscribe('goals');
    });
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
