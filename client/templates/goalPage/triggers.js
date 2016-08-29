Template.goalPage.events({
    'click #removeGoal': function(event) {
        event.preventDefault();
        var userId = Meteor.userId();
        Meteor.call('removeGoal', userId);
    }
});

Template.goalPage.onDestroyed(function() {
    if (Session.equals('removeGoalOnDestroyGoalPage', true)) {
        Session.set('removeGoalOnDestroyGoalPage', false);
        var userId = Meteor.userId();
        console.log('removed goal!');
        Meteor.call('removeGoal', userId);
    }
});
