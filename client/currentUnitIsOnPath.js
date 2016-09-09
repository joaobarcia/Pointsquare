Template.registerHelper('currentUnitIsOnPath', function() {
    var nodeId = FlowRouter.getParam('nodeId');
    var nextUnit = Meteor.user().nextUnit;
    return nodeId === nextUnit;
});
