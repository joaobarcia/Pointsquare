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
  },
  displayExamResults: function() {
    return Session.get('displayExamResults');
  },
  correctPercentage: function() {
    var examResults = Session.get('examResults');
    var numberOfAnswers = Object.keys(examResults).length;
    var correctAnswers = 0;
    for (nodeId in examResults) {
      if (examResults[nodeId]) correctAnswers++
    };
    var correctPercentage = Math.round((correctAnswers / numberOfAnswers) * 100);
    return correctPercentage;
  },
});
