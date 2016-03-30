Template.conceptCard.events({
  'click .set-goal': function(event, template) {
    event.preventDefault();
    var nodeId = template.data._id;
    console.log(nodeId);
    Meteor.call("setGoal", nodeId, Meteor.userId(),function(e,r){
      var goalInfo = Personal.findOne({node: nodeId, user: Meteor.userId()});
      var goalState = goalInfo? goalInfo.state : 0;
      var goalCompleted = goalState > 0.9;
      if(goalCompleted){
        Session.set("goalCompleted",true);
      }
      else{
        Session.set("goalCompleted",false);
      }
      FlowRouter.go('goalPage');
    });
  }
});
