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
  correctAnswers: function() {
    const examResults = Session.get('examResults');
    var correctAnswers = 0;
    for (nodeId in examResults) {
      if (examResults[nodeId]) correctAnswers++
    };
    return correctAnswers;
  },
  totalQuestions: function() {
    const examResults = Session.get('examResults');
    const numberOfAnswers = Object.keys(examResults).length;
    return numberOfAnswers;
  },
  correctPercentage: function() {
    const examResults = Session.get('examResults');
    const numberOfAnswers = Object.keys(examResults).length;
    var correctAnswers = 0;
    for (nodeId in examResults) {
      if (examResults[nodeId]) correctAnswers++
    };
    var correctPercentage = Math.round((correctAnswers / numberOfAnswers) * 100);
    return correctPercentage;
  },
  allAnswersAreCorrect: function() {
    const examResults = Session.get('examResults');
    const numberOfAnswers = Object.keys(examResults).length;
    var correctAnswers = 0;
    for (nodeId in examResults) {
      if (examResults[nodeId]) correctAnswers++
    };
    return numberOfAnswers == correctAnswers;
  }
});

Template.examInfoBar.helpers({
  examLanguagesNames: function() {
    const nodeId = this._id;
    if (typeof Meteor.globalFunctions.getNeeds(nodeId) !== 'undefined' && Meteor.globalFunctions.getNeeds(nodeId) !== null) {
      const languagesIds = Object.keys(Meteor.globalFunctions.getNeeds(nodeId).languages);
      var examLanguagesNames = [];
      for (let id of languagesIds) {
        examLanguagesNames.push(Nodes.findOne(id).name);
      }
      return examLanguagesNames
    }
  },
  bottomPaddingIfGoalBar: function() {
    const goalExists = Blaze._globalHelpers.goalExists();
    if (goalExists) {
      return "bottom-padding-for-goalbar";
    } else return "";
  }
});
