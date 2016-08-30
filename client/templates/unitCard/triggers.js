Template.unitCard.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 1
        });
    });
};

Template.unitCard.events({
    'click .set-goal': function(event, template) {
        event.preventDefault();
        Session.set('isLoading', true);
        var nodeId = template.data._id;
        Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
            if( r ){ FlowRouter.go('/content/' +r); }
            else{ console.log("No options!"); }
            Session.set('isLoading', false);
        });
    }
});
