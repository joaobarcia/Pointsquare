Template.unitEdit.rendered = function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      var nodeId = FlowRouter.getParam('nodeId');
      var contentNode = Nodes.findOne({
        _id: nodeId
      }) || {};
      var tempContent = {};
      if (contentNode.content !== "undefined") {
        var tempContent = contentNode.content
        _.remove(tempContent, {
          type: 'unitEvaluationSection'
        });
      };
      Session.set('tempContent', tempContent);

      //console.log('conceptEdit rendered > subs ready');
      Meteor.globalFunctions.needsAsJSONSession();
      //grantsAsJSONSession();

      var deletedNeedsSets = [];
      Session.set('deletedNeedsSets', deletedNeedsSets);
    }
  });
};

// Template.conceptEditSelectBox.rendered = function() {
//     this.autorun(() => {
//         if (Template.instance().parent(1).subscriptionsReady()) {
//             //console.log('conceptEditSelectBox rendered > subs ready');
//             Meteor.globalFunctions.applySelectizeCode();
//         }
//     });
// };

Template.unitEdit.events({
  'click #deleteUnit': function(event) {
    event.preventDefault();
    var nodeId = FlowRouter.getParam('nodeId');
    Meteor.call('removeNode', nodeId);
    FlowRouter.go('dashboard');
  },
  'click .add-set': function(event) {
    event.preventDefault();
    var needsObject = Session.get('needsObject');
    needsObject.push({
      '_id': 'newSet-' + Math.random().toString(36).substr(2, 9),
      'contains': {}
    });
    Session.set('needsObject', needsObject);
    //console.log(Session.get('needsObject'));

    //tempContent.splice(section, 1);
  },
  'click .remove-set': function(event) {
    event.preventDefault();
    var setId = event.target.id;
    setId = setId.replace('remove-', '');
    //console.log(setId);

    var needsObject = Session.get('needsObject');
    needsObject = _.reject(needsObject, {
      '_id': setId
    });
    Session.set('needsObject', needsObject);

    var deletedNeedsSets = Session.get('deletedNeedsSets');
    deletedNeedsSets.push(setId);
    Session.set('deletedNeedsSets', deletedNeedsSets);
  },
});

/*function applySort() { // must apply sort and dropdown properties everytime the content is changed
    Sortable.create(document.getElementById('content-sections'), {
        animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
        draggable: '.section-card', // Restricts sort start click/touch to the specified element
        handle: '.section-handle', // Specifies which items inside the element should be sortable
        onEnd: function(evt) { // When sections are moved, propagate information to session variable
            console.log(evt.oldIndex);
            console.log(evt.newIndex);
            var tempContent = Session.get('tempContent');
            console.log(tempContent);
            tempContent.move(evt.oldIndex, evt.newIndex);
            console.log(tempContent);
            Session.set('tempContent', tempContent);
        },
        disabled: true,
    });

    [].forEach.call(document.getElementById('content-sections').getElementsByClassName('content-fields'), function(el) {
        Sortable.create(el, {
            group: 'contents',
            animation: 150,
            draggable: ".collection-item",
            handle: '.content-handle',
            disabled: true,
        });
    });
};*/

function applyDropdown() { // jquery was being called before the changes were propagated to the DOM
  if (Session.get('tempContent') !== undefined) {
    var sectionsInJSON = Session.get('tempContent').length;
    var sectionsInHTML = $('.dropdown-button.add-content').length;
    if (sectionsInJSON == sectionsInHTML) { // if the changes have been propagated, call jquery
      $('.dropdown-button.add-content').dropdown({
        inDuration: 300,
        outDuration: 225,
        //constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        //gutter: 0, // Spacing from edge
        //belowOrigin: false, // Displays dropdown below the button
        //alignment: 'left' // Displays dropdown with edge aligned to the left of button
      });
    } else {
      setTimeout(applyDropdown, 50); // re-run function asynchronously until conditions are met
    }
  } else {
    setTimeout(applyDropdown, 50); // re-run function asynchronously until conditions are met
  }
}



Template.unitEditContent.rendered = function() {
  //console.log('defined');
  //var tempContent = Session.get('tempContent');
  applyDropdown();
  Tracker.autorun(function() { // apply on every change of Session.get('tempContent')
    var tempContent = Session.get('tempContent'); // must call Session (even if not used) to make function reactive
    //applySort();
    applyDropdown();

  });
};

Template.unitEditContent.events({
  'click .remove-section': function(event) {
    event.preventDefault();
    var section = event.target.id;
    var tempContent = Session.get('tempContent');
    tempContent.splice(section, 1);
    Session.set('tempContent', tempContent);
  },
  'click .add-section': function(event) {
    event.preventDefault();
    tempContent = Session.get('tempContent');
    tempContent.push({
      "type": "unitSection",
      "subContent": []
    });
    Session.set('tempContent', tempContent);
  },
  'click .add-text': function(event) {
    event.preventDefault();
    var section = event.target.id;
    var tempContent = Session.get('tempContent');
    tempContent[section].subContent.push({
      "type": "text",
      "text": ""
    });
    Session.set('tempContent', tempContent);
  },
  'click .add-video': function(event) {
    event.preventDefault();
    var section = event.target.id;
    var tempContent = Session.get('tempContent');
    tempContent[section].subContent.push({
      "type": "youtube",
      "youtubeVidID": ""
    });
    Session.set('tempContent', tempContent);
  },
  'click .add-image': function(event) {
    event.preventDefault();
    var section = event.target.id;
    var tempContent = Session.get('tempContent');
    tempContent[section].subContent.push({
      "type": "remoteImage",
      "remoteImgURL": ""
    });
    Session.set('tempContent', tempContent);
  },
  'click .remove-content': function(event) {
    event.preventDefault();
    var arrayOfIds = _.words(event.target.id, /[^, ]+/g); // extract array indexes from @index ids
    var section = arrayOfIds[0];
    var content = arrayOfIds[1];
    var tempContent = Session.get('tempContent');
    tempContent[section].subContent.splice(content, 1);
    Session.set('tempContent', tempContent);
  },
  /* 'submit': function(event) {
       event.preventDefault();
       console.log("entered event");
   },*/
  'input .content-input': function(event) {
    event.preventDefault();
    var arrayOfIds = _.words(event.target.id, /[^, ]+/g); // extract array indexes from @index ids
    var section = arrayOfIds[0];
    var content = arrayOfIds[1];
    var keyToChange = arrayOfIds[2];
    var tempContent = Session.get('tempContent');
    /*if (keyToChange == 'text') { // text strings need to be escaped
        console.log("IT IS TEXT!!!");
        tempContent[section].subContent[content][keyToChange] = escape(event.target.value);
    } else {*/
    tempContent[section].subContent[content][keyToChange] = event.target.value;
    //};
    Session.set('tempContent', tempContent);
  },
});

// function applySelectizeCode() {
//     //console.log('applySelectizeCode');
//     var conceptsMappedForSelectize = Nodes.find({
//         type: 'concept'
//     }, {
//         fields: {
//             _id: 1,
//             name: 1,
//             description: 1
//         }
//     }).fetch();
//     //console.log(conceptsMappedForSelectize);
//
//     var needsObject = Session.get("needsObject");
//     //console.log(needsObject);
//
//     // For each set of concepts, apply selectize js to the respective selectize html
//     _.forEach(needsObject, function(nSet) {
//         var setId = nSet['_id'];
//         //console.log('#' + setId);
//         var $select = $('#' + setId).selectize({
//             theme: 'links',
//             maxItems: null,
//             valueField: '_id',
//             searchField: ['name', 'description'],
//             options: conceptsMappedForSelectize,
//
//             render: {
//                 option: function(data, escape) {
//                     return '<div class="option">' +
//                         '<h5><span class="title"><strong>' + escape(data.name) + '</strong></span><h5>' +
//                         '<span class="url">' + escape(data.description) + '</span>' +
//                         '</div>';
//                 },
//                 item: function(data, escape) {
//                     return '<div class="item">' + escape(data.name) + '</div>';
//                 }
//             }
//         });
//
//         // For each set of concepts, set the default values
//         subConcepts = nSet.contains;
//         _.forEach(subConcepts, function(nSubConcept) {
//             subConceptId = nSubConcept['_id'];
//             $('#' + setId).selectize()[0].selectize.addItem(subConceptId);
//         });
//     });
// }

// Template.conceptEditSelectBox.rendered = function() {
//     this.autorun(() => {
//         if (Template.instance().parent(1).subscriptionsReady()) {
//             //console.log('conceptEditSelectBox rendered > subs ready');
//             applySelectizeCode();
//             /*$(document).ready(function() {
//                 $('.tooltipped').tooltip({
//                     delay: 20
//                 });
//             });*/
//
//
//
//             //$('#select-links').selectize()[0].selectize.setValue(["MPhF2KaYg2wsA5ScG"]);
//         }
//     });
//
// };

AutoForm.hooks({
  unitEdit: {
    onSubmit: function(doc) {
      const nodeId = FlowRouter.getParam('nodeId');

      // Handle new and edited need sets
      var needsObject = Session.get('needsObject');
      console.log('needsObject: ' + needsObject);

      _.forEach(needsObject, function(n) {
        var setId = n['_id'];
        //console.log('setId:' + setId);
        // WARNING SE SO DEVOLVER UM VALOR VEM UM NUMERO, TEM DE SE METER ARRAY
        var needsAsArrayOfId = $('#' + setId).selectize()[0].selectize.getValue();
        //console.log('needsAsArrayOfId:' + needsAsArrayOfId);
        var needsMappedAsArrayofObjects = {};
        for (var i = 0; i < needsAsArrayOfId.length; i += 1) {
          //console.log(i);
          needsMappedAsArrayofObjects[needsAsArrayOfId[i]] = true;
        };
        if (_(setId).startsWith('newSet')) {
          // console.log("entrou no newSet");
          // console.log('meter novo need no node:' + nodeId);
          // console.log('com o array de objectos:' + needsMappedAsArrayofObjects);
          // console.log('primeiro elemento:' + needsMappedAsArrayofObjects[needsAsArrayOfId[0]]);

          console.log('addNeed: ');
          console.log(needsMappedAsArrayofObjects)
            //Meteor.call('addNeed', nodeId, needsMappedAsArrayofObjects);
        } else {
          console.log('editNeed: ' + setId);
          console.log(needsMappedAsArrayofObjects);
          Meteor.call('editNeed', setId, needsMappedAsArrayofObjects);
        };
      });

      // Handle deleted need sets
      var deletedNeedsSets = Session.get('deletedNeedsSets');
      for (setId of deletedNeedsSets) {

        console.log('removeNeed: ');
        console.log(setId);
        Meteor.call('removeNeed', setId);
      };

      // Handle grants
      var grantsMappedAsObject = {};
      if (typeof doc.grants !== 'undefined') {
        for (var i = 0; i < doc.grants.length; i += 1) {
          grantsMappedAsObject[doc.grants[i]] = true;
        }
      };
      // console.log(nodeId);
      // console.log(grantsMappedAsObject);
      Meteor.call('editGrants', nodeId, grantsMappedAsObject);

      // Handle NAME, DESCRIPTION AND CONTENT
      var content = Session.get('tempContent'); // fetch content
      var evaluation = { // create evaluation object
        "type": "unitEvaluationSection"
      };
      evaluation.evaluationType = doc.evaluationType; // define evaluation type from autoform
      if (doc.evaluationType == "exerciseRadioButton") { // add options or answers to evaluation
        evaluation.question = doc.exerciseRadioButton.question;
        evaluation.options = doc.exerciseRadioButton.options;
      } else if (doc.evaluationType == "exerciseString") {
        evaluation.question = doc.exerciseString.question;
        evaluation.answers = doc.exerciseString.answers;
      }

      content.push(evaluation); // push evaluation object into content array
      doc.content = content;

      // change language
      console.log('nodeId: ' + nodeId);
      console.log('languageId: ' + doc.language)

      Meteor.call('editLanguage', nodeId, doc.language);

      delete doc.language;
      delete doc.needs;
      delete doc.grants;
      delete doc.evaluationType;

      // If description is empty, set it as empty. Otherwise autoform does not return  description
      if (typeof doc.description == 'undefined' || doc.description == null) {
        doc.description = ""
      };
      var parameters = doc;
      console.log(parameters);

      Session.set('tempContent', []);

      // Set name, description, content
      Meteor.call('editNode', nodeId, parameters);

      FlowRouter.go('/content/' + nodeId);
      this.done();
      return false;
    }
  }
});
