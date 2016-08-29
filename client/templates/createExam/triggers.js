AutoForm.hooks({
    createExam: {
        onSubmit: function(doc) {
            /*var exercisesMappedAsObject = {};
            if (doc.exercises != null) {
                for (var i = 0; i < doc.exercises.length; i += 1) {
                    exercisesMappedAsObject[doc.exercises[i]] = true;
                }
                doc.exercises = exercisesMappedAsObject;
            };
            delete doc.exercises;
            console.log(exercisesMappedAsObject);*/

            var examDefinitions = {}
            examDefinitions.type = 'exam';
            examDefinitions.parameters = doc;
            examDefinitions.contains = doc.exercises;//exercisesMappedAsObject;

            console.log(examDefinitions);

            Meteor.call('create', examDefinitions, function(error, result) {
                nodeId = result;
                FlowRouter.go('/exam/' + nodeId);
                //FlowRouter.go('search');
            });
            this.done();
            return false;
        }
    }
});
