Template.examEdit.onCreated(function() {
    //console.log('conceptEdit >onCreated');
    var self = this;
    self.autorun(function() {
        var examId = FlowRouter.getParam('nodeId');
    });
});

Template.examEdit.events({
  'click #deleteExam': function(event) {
    event.preventDefault();
    var nodeId = FlowRouter.getParam('nodeId');
    Meteor.call('removeExam', nodeId);
    FlowRouter.go('dashboard');
  },
});
