AutoForm.hooks({
    createExam: {
        onSubmit: function(doc) {
          var exercisesMappedAsObject = {};
          if (doc.exercises != null) {
              for (var i = 0; i < doc.exercises.length; i += 1) {
                  exercisesMappedAsObject[doc.exercises[i]] = true;
              }
              doc.exercises = exercisesMappedAsObject;
          };
          delete doc.exercises;
          console.log(exercisesMappedAsObject);

            //  Meteor.call('create', conceptDefinitions, function(error, result) {
            //      nodeId = result;
            //      FlowRouter.go('/concept/' + nodeId);
            //      //FlowRouter.go('search');
            //  });
            this.done();
            return false;
        }
    }
});
