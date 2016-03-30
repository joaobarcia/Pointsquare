Template.goalPage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('nodes');
        self.subscribe('personal');
        self.subscribe('goals');
    });
    var goal = Goals.findOne({user:Meteor.userId()});
    if(goal!==null){
      Meteor.call("setGoal",goal.node,Meteor.userId(),function(e,r){
        var goalInfo = Personal.findOne({node: goal.node, user: Meteor.userId()});
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
