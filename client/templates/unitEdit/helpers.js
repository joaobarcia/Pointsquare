Template.unitEdit.helpers({

  unitLanguage: function() {
    const nodeId = FlowRouter.getParam('nodeId');
    if (typeof Meteor.globalFunctions.getNeeds(nodeId) !== 'undefined' && Meteor.globalFunctions.getNeeds(nodeId) !== null) {
      return Meteor.globalFunctions.getNeeds(nodeId).language;
    }
  },

  contentEditPage: function() {
    var nodeId = FlowRouter.getParam('nodeId');
    var content = Nodes.findOne({
      _id: nodeId
    }) || {};
    return content;
  },
  unitEditSchema: function() {
    return Schema.Unit;
  },
  needs: function() {
    return Session.get('needsObject');
  },
  /*    evaluation: function() {
          var evaluation = _.find(Template.currentData().content, {
              type: 'unitEvaluationSection'
          });
          console.log(evaluation);
          return evaluation.evaluationType
      },*/
  grants: function() {
    var nodeId = FlowRouter.getParam('nodeId');
    var content = Nodes.findOne({
      _id: nodeId
    }) || {};
    if (typeof content.grants !== 'undefined') {
      return Object.keys(content.grants);
    } else return [];
  },

  unitEditDoc: function() {
    // load stored unit values and pass them with necessary modif to autoform doc 'unitEditDoc'
    if (Template.currentData().name != undefined) {
      var unitEditDoc = {};
      unitEditDoc.name = Template.currentData().name;
      unitEditDoc.description = Template.currentData().description;
      //console.log(Template.currentData());

      //unitEditDoc.requiredConcepts = _.pluck(Template.currentData().requires, 'rid');
      //unitEditDoc.grantedConcepts = _.pluck(Template.currentData().grants, 'rid');

      var evaluation = _.find(Template.currentData().content, {
        type: 'unitEvaluationSection'
      });

      unitEditDoc.evaluationType = evaluation.evaluationType;

      unitEditDoc.exerciseRadioButton = {};
      unitEditDoc.exerciseRadioButton.question = evaluation.question;
      unitEditDoc.exerciseRadioButton.options = evaluation.options;

      unitEditDoc.exerciseString = {};
      unitEditDoc.exerciseString.question = evaluation.question;
      unitEditDoc.exerciseString.answers = evaluation.answers;

      return unitEditDoc;
    } else return {};
  },
  /*    submitting: function() {
          console.log(Session.get("callStatus"));
          return Session.get("callStatus") == "submitting unit";
      },*/
});
Template.unitEditContent.helpers({
  tempContent: function() {
    return Session.get('tempContent');
  },
});
