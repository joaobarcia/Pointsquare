Template.examPage.helpers({
  examPage: function() {
    var examId = FlowRouter.getParam('nodeId');
    var exam = Nodes.findOne({
      _id: examId
    }) || {};
    console.log(exam);
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

Template.examInfoBar.helpers({
  examLanguagesNames: function() {
    const nodeId = this._id;
    if (typeof Meteor.globalFunctions.getNeeds(nodeId) !== 'undefined' && Meteor.globalFunctions.getNeeds(nodeId) !== null) {
      const languagesIds = Object.keys(Meteor.globalFunctions.getNeeds(nodeId).languages);
      // console.log(languagesIds);
      var examLanguagesNames = [];
      for (let id of languagesIds){
        examLanguagesNames.push(Nodes.findOne(id).name);
      }
      console.log(examLanguagesNames);
      return examLanguagesNames
    }
  }
});
