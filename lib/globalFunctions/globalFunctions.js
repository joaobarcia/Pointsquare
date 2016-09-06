Meteor.globalFunctions = {
    needsAsJSONSession: function() {
        var nodeId = FlowRouter.getParam('nodeId');
        Meteor.call("getNeeds", nodeId, function(e, r) {
            Session.set("neededConceptsInConceptEdit", r)
        });
        var neededConceptsInConceptEdit = Session.get("neededConceptsInConceptEdit");
        if (typeof neededConceptsInConceptEdit !== 'undefined') {
            var needsCrazyObject = neededConceptsInConceptEdit.sets;
            //console.log(needsCrazyObject);
            var needsJSONArray = [];
            for (var setId in needsCrazyObject) {
                var obj = {};
                obj["_id"] = setId;
                obj.contains = [];
                for (var conceptId in needsCrazyObject[setId]) {
                    var conceptInfo = Nodes.findOne(conceptId, {
                        fields: {
                            name: 1,
                            description: 1
                        }
                    });
                    obj.contains.push(conceptInfo)
                }
                needsJSONArray.push(obj);
            };
            console.log(needsJSONArray);
            Session.set("needsObject", needsJSONArray);
        }
    },

    applySelectizeCode: function() {
        console.log('applySelectizeCode');
        var conceptsMappedForSelectize = Nodes.find({
            type: 'concept'
        }, {
            fields: {
                _id: 1,
                name: 1,
                description: 1
            }
        }).fetch();
        //console.log(conceptsMappedForSelectize);

        var needsObject = Session.get("needsObject");
        //console.log(needsObject);

        // For each set of concepts, apply selectize js to the respective selectize html
        _.forEach(needsObject, function(nSet) {
            var setId = nSet['_id'];
            //console.log('#' + setId);
            var $select = $('#' + setId).selectize({
                theme: 'links',
                maxItems: null,
                valueField: '_id',
                searchField: ['name', 'description'],
                options: conceptsMappedForSelectize,

                render: {
                    option: function(data, escape) {
                        return '<div class="option">' +
                            '<h5><span class="title"><strong>' + escape(data.name) + '</strong></span><h5>' +
                            '<span class="url">' + escape(data.description) + '</span>' +
                            '</div>';
                    },
                    item: function(data, escape) {
                        return '<div class="item">' + escape(data.name) + '</div>';
                    }
                }
            });

            // For each set of concepts, set the default values
            if(typeof nSet.contains !== 'undefined') {
            var subConcepts = nSet.contains;
            _.forEach(subConcepts, function(nSubConcept) {
                    subConceptId = nSubConcept['_id'];
                    $('#' + setId).selectize()[0].selectize.addItem(subConceptId);

            })
          };
            /*        // UNDER CONSTRUCTION. PROBABLY NOT NECESSARY
                    //Add concepts to needsObject session, everytime a new concept is added
                    $('#' + setId).selectize()[0].selectize.on('change', function() {
                        var needsObject = Session.get('needsObject');
                        console.log(setId + ' : ' + $('#' + setId).selectize()[0].selectize.getValue());
                        //needsObject[setId].contains = $('#' + setId).selectize()[0].selectize.getValue();
                        Session.set('needsObject', needsObject);
                        console.log(needsObject);
                    });*/
        });
    },

    getExamContent: function() {
      var examId = FlowRouter.getParam('nodeId');
      var exam = Nodes.findOne({
          _id: examId
      }) || {};
      if (typeof exam.contains != "undefined") {
          var examContentsIDs = exam.contains;
          var examContents = Nodes.find({
              "_id": {
                  "$in": examContentsIDs
              }
          }).fetch();
      };
      return examContents;
    }
}
