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

AutoForm.hooks({
  examEdit: {
    onSubmit: function(doc) {
      var nodeId = FlowRouter.getParam('nodeId');

      var examDefinitions = {}
      examDefinitions = doc;
      var examContains = doc.exercises; //exercisesMappedAsObject;
      delete doc.exercises

      Meteor.call('editNode', nodeId, examDefinitions, function(error, result) {
        Meteor.call('editContains', nodeId, examContains, function(error, result) {
          FlowRouter.go('/exam/' + nodeId);
        });

        //FlowRouter.go('search');
      });
      //Meteor.call('editContains', nodeId, examContains);

      //FlowRouter.go('/exam/' + nodeId);
      this.done();
      return false;
    }
  }
});
