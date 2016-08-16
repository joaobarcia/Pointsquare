Template.examPage.helpers({
    examPage: function() {
        var examId = FlowRouter.getParam('examId');
        var exam = Nodes.findOne({
            _id: examId
        }) || {};
        return exam;
    },
    examContents: function() {
        var examId = FlowRouter.getParam('examId');
        var exam = Nodes.findOne({
            _id: examId
        }) || {};
        if (typeof exam.contains != "undefined") {
            var examContentsIDs = Object.keys(exam.contains);
            var examContents = Nodes.find({
                "_id": {
                    "$in": examContentsIDs
                }
            }).fetch();
        };
        console.log(examContents);
        return examContents;
    }
});
