Template.examEdit.helpers({
    examEditPage: function() {
        var examId = FlowRouter.getParam('nodeId');
        var exam = Nodes.findOne({
            _id: examId
        }) || {};
        return exam;
    },
    examEditSchema: function() {
        return Schema.Exam;
    },
    exercisesAsSelectizeArray: function() {
        var examId = FlowRouter.getParam('nodeId');
        var exam = Nodes.findOne({
            _id: examId
        }) || {};
        var exerciseIds = _.values(exam.contains);
        return exerciseIds;
    }
});
