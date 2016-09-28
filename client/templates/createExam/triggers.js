AutoForm.hooks({
  createExam: {
    onSubmit: function(doc) {

      var examDefinitions = {}
      examDefinitions.type = 'exam';
      examDefinitions.contains = doc.exercises; //exercisesMappedAsObject;
      delete doc.exercises;
      examDefinitions.parameters = doc;


      console.log(examDefinitions);

      Meteor.call('create', examDefinitions, function(error, result) {
        const nodeId = result;
        Meteor.call("addAuthor", nodeId, Meteor.userId(), function(error, result) {
          FlowRouter.go('/exam/' + nodeId);
        });
      });
      this.done();
      return false;
    }
  }
});
