Template.examPage.helpers({
    examPage: function() {
        var examId = FlowRouter.getParam('nodeId');
        var exam = Nodes.findOne({
            _id: examId
        }) || {};
        return exam;
    },
    examContents: function() {
      var examContent = Meteor.globalFunctions.getExamContent();
      return examContent;
    }
});
