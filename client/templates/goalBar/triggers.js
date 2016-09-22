Template.goalBar.onRendered(function() {
  $(".bottom-goalbar").fadeIn()
});

Template.goalBar.events({
  'click .start-learning': function(event, template) {
    event.preventDefault();
    var nodeId = Meteor.user().goal;
    Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
      if (r) {
        FlowRouter.go('/content/' + r);
      } else {
        Session.set("noOptionsFound", nodeId);
      }
    });
  },
  "click .next-unit": function(event, template) {
    event.preventDefault();
    var nodeId = FlowRouter.getParam('nodeId');
    var unit = Meteor.user().nextUnit;
    var triedUnits = Session.get("triedUnits") || {};
    if(unit == nodeId){
      triedUnits[unit] = true;
      Session.set("triedUnits", triedUnits);
      var goalId = Meteor.user().goal;
      var goal = {}; goal[goalId] = true;
      Session.set('isLoading', true);
      unit = Meteor.globalFunctions.findUsefulContent(goal,triedUnits);
      if(unit){
        FlowRouter.go('/content/' + unit);
        Session.set('isLoading', false);
        Meteor.call("setGoal",goalId,unit,Meteor.userId());
      }
      else{
        //se não houver mais alternativas, voltar à primeira ou então avisar que não há hipóteses
        var unit = Object.keys(triedUnits)[0];
        Session.set("triedUnits", {});
        FlowRouter.go('/content/' + unit);
        Meteor.call("setGoal",goalId,unit,Meteor.userId());
      }
    }
    else{
      if (unit) {
        FlowRouter.go('/content/' + unit);
        triedUnits[unit] = true;
        Session.set("triedUnits", triedUnits);
        Session.set('isLoading', false);
        FlowRouter.go('/content/' + unit);
      } else {
        Session.set("noOptionsFound", nodeId);
      }
    }
  },
  "click #remove_goal": function(event, template) {
    event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('removeGoal', userId);
  },
  "click .reset-goal": function(event, template) {
    //event.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('removeGoal', userId);
  }
});
