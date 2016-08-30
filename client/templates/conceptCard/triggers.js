Template.conceptCard.events({
    'click .set-goal': function(event, template) {
        event.preventDefault();
        Session.set('isLoading', true);
        var nodeId = template.data._id;
        Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
            var nextUnitId = r;
            FlowRouter.go('/content/' +nextUnitId);
            Session.set('isLoading', false);
        });
    }
});
