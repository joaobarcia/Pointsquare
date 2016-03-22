Template.unitPage.helpers({
  contentPage: function() {
    var nodeId = FlowRouter.getParam('contentId');
    var content = Nodes.findOne({
      _id: nodeId
    }) || {};
    return content;
  },

  /*authors: function() {
      var authors = Template.currentData().authors;
      var names = "";
      for(var id in authors){
          names += Meteor.users.findOne(id).username+", ";
      }
      return names.slice(0,-2);
  },*/
  /*state: function() {
        return Knowledge.findOne().value;
    },

*/
  grantedConcepts: function() {
    var nodeId = FlowRouter.getParam('contentId');
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
  },

  neededConcepts: function() {
    var nodeId = FlowRouter.getParam('contentId');
    var content = Nodes.findOne({
      _id: nodeId
    }) || {};
    // if content.needs exist
    if (typeof content.needs !== "undefined") {
      //extract needed concepts as array of ids and query db
      var neededIds = Object.keys(content.needs);
      var neededConcepts = Requirements.find({
        "_id": {
          "$in": neededIds
        }
      }).fetch();
      // for(let setOfConcepts of neededConcepts){
      //   console.log(Object.keys(setOfConcepts.weights))
      // };
      return neededConcepts;
    } else return null;
  },

  'doingExercise': function() {
    return 1;
    //return Session.get('callStatus') == 'doingExercise';
  },

  'learning': function() {
    return 0;
    //return Session.get('callStatus') == 'learning' || Session.get('callStatus') == 'unlearning';
  },

  'learned': function() {
    return 0;
    //return Session.get('callStatus') == 'learned';
  },

  'unlearned': function() {
    return 0;
    //return Session.get('callStatus') == 'unlearned';
  },

  /*    'learnedConcept': function() {
          var newConcepts = Session.get('newConcepts');
          console.log(knowledge.find({
              'rid': {
                  $in: newConcepts
              }
          }).fetch());
          return knowledge.find({
              'rid': {
                  $in: newConcepts
              }
          }, {
              limit: 3
          });
          //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
      },*/

  /*    'activatedUnit': function() {
          var newConcepts = Session.get('newUnits');
          return knowledge.find({
              'rid': {
                  $in: newUnits
              }
          }, {
              limit: 3
          });
          //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
      },

      'unlearnedConcept': function() {
          var lostConcepts = Session.get('lostConcepts');
          return knowledge.find({
              'rid': {
                  $in: lostConcepts
              }
          }, {
              limit: 3
          });
          //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
      },

      'deactivatedUnit': function() {
          var newConcepts = Session.get('newConcepts');
          return knowledge.find({
              'rid': {
                  $in: newConcepts
              }
          }, {
              limit: 3
          });
          //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
      },*/



});
Template.unitContent.helpers({
  'unitIsOneSectionAndNoExercise': function() {
    var unitContent = this.content;
    var numberOfSections = _.filter(unitContent, {
      'type': 'unitSection'
    }).length;
    var noExercise = _.includes(_.find(unitContent, {
      'type': 'unitEvaluationSection'
    }), 'userConfirmation');
    if (numberOfSections == 1 && noExercise) {
      return 1
    } else return 0;
  }
});

Template.relatedConcepts.helpers({
  subConcepts: function(weights) {
    var subConceptIds = Object.keys(weights);
    var subConcepts = Nodes.find({
      "_id": {
        "$in": subConceptIds
      }
    }).fetch();
    return subConcepts;
  }
});
