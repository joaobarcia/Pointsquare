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
    var nodeId = template.data._id;
    console.log(nodeId);
    Meteor.call("setGoal", nodeId, Meteor.userId());
    FlowRouter.go('goalPage');
  }
});
