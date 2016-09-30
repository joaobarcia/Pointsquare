Template.unitPage.helpers({
  contentPage: function() {
    const nodeId = FlowRouter.getParam('nodeId');
    var content = Nodes.findOne({
      _id: nodeId
    }) || {};
    return content;
  }
});

Template.unitInfoBar.helpers({
  unitLanguageName: function() {
    const nodeId = FlowRouter.getParam('nodeId');
    if (typeof Meteor.globalFunctions.getNeeds(nodeId) !== 'undefined' && Meteor.globalFunctions.getNeeds(nodeId) !== null) {
      const languageId = Meteor.globalFunctions.getNeeds(nodeId).language;
      const languageName = Nodes.findOne(languageId).name;
      return languageName;
    }
  },
  bottomPaddingIfGoalBar: function() {
    const goalExists = Blaze._globalHelpers.goalExists();
    if (goalExists) {
      return "bottom-padding-for-goalbar";
    } else return "";
  }
});

Template.unitContent.helpers({
  'numberOfSections': function() {
    if (typeof Template.currentData().content !== 'undefined' && Template.currentData().content !== null) {
      const numbersToWord = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'sixteen'];
      const numberOfSections = Template.currentData().content.length;
      return numbersToWord[numberOfSections];
    }
  },
  'disableTabsMenu': function() {
    // Disable tabs if unit is is only evaluation or section + evaluation
    var unitContent = Template.currentData().content;
    var numberOfSections = _.filter(unitContent, {
      'type': 'unitSection'
    }).length;
    // var noExercise = _.includes(_.find(unitContent, {
    //   'type': 'unitEvaluationSection'
    // }), 'userConfirmation');
    if (numberOfSections < 2) {
      return true;
    } else return false;
  },

  'failedUnitAndNoGoal': function() {
    var failedUnitAndNoGoal;
    if (typeof Session.get('failedUnitAndNoGoal') !== 'undefined') {
      failedUnitAndNoGoal = Session.get('failedUnitAndNoGoal');
    } else failedUnitAndNoGoal = false;
    return failedUnitAndNoGoal;
  }
});

Template.relatedConcepts.helpers({
  neededConcepts: function() {
    var needs = Session.get("needs");
    var neededSetsOfConceptsArray = needs ? Object.keys(needs) : [];
    return neededSetsOfConceptsArray;
  },
  subConceptsOf: function(setOfConceptsID) {
    if (typeof setOfConceptsID !== "undefined" && setOfConceptsID !== null) {
      var setId = setOfConceptsID;
      var subConcepts = {};
      var needs = Session.get("needs");
      if (typeof needs[setId] !== "undefined" && needs[setId] !== null) {
        var subConceptIds = Object.keys(needs[setId]);
        var subConcepts = Nodes.find({
          "_id": {
            "$in": subConceptIds
          }
        }).fetch();
      };
      return subConcepts;
    }
  },
  grantedConcepts: function() {
    var nodeId = FlowRouter.getParam('nodeId');
    var content = Nodes.findOne({
      _id: nodeId
    }) || {};
    // if content.grants exist
    if (typeof content.grants !== "undefined") {
      //extract granted concepts as array of ids and query db
      var grantedIds = Object.keys(content.grants);
      var grantedConcepts = Nodes.find({
        "_id": {
          "$in": grantedIds
        }
      }).fetch();
      return grantedConcepts;
    } else return null;
  }
});
