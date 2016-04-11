Template.conceptCard.events({
    'click .set-goal': function(event, template) {
        event.preventDefault();
        Session.set('isLoading', true);
        var nodeId = template.data._id;
        console.log(nodeId);
        Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
            FlowRouter.go('goalPage');
            Session.set('isLoading', false);
        });
    }
});
