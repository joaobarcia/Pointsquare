Template.conceptCard.events({
    'click .set-goal': function(event, template) {
        event.preventDefault();
        Session.set('isLoading', true);
        var nodeId = template.data._id;
        Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
            if( r ){ FlowRouter.go('/content/' +r); }
            else{
              console.log("No options found!");
              Session.set("noOptionsFound",nodeId);
              removeGoal(Meteor.userId());
            }
            Session.set('isLoading', false);
        });
    },
    'click .just-set-goal': function(event, template) {
        event.preventDefault();
        Session.set('isLoading', true);
        var nodeId = template.data._id;
        Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
            if( r ){ 0; }
            else{
              console.log("No options found!");
              Session.set("noOptionsFound",nodeId);
              removeGoal(Meteor.userId());
            }
            Session.set('isLoading', false);
        });
    }
});
