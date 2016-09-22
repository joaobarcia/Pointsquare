AutoForm.hooks({
    createConcept: {
        onSubmit: function(doc) {
            var needsMappedAsArrayofObjects = [];
            if (doc.needs != null) {
                for (var i = 0; i < doc.needs.length; i += 1) {
                    needsMappedAsArrayofObjects[i] = {};
                    for (var n = 0; n < doc.needs[i].length; n += 1) {
                        needsMappedAsArrayofObjects[i][doc.needs[i][n]] = true;
                    }
                }
            }
            //console.log(needsMappedAsArrayofObjects);
            delete doc.needs;

            var conceptDefinitions = {};
            conceptDefinitions.type = 'concept';
            conceptDefinitions.parameters = doc;
            conceptDefinitions.needs = {};
            conceptDefinitions.needs.concepts = needsMappedAsArrayofObjects;

            var nodeId;
            //console.log(conceptDefinitions);
             Meteor.call('create', conceptDefinitions, function(error, result) {
                 //nodeId = result;
                AutoForm.resetForm("createConcept");

                // WARNING: RELOAD IS VERY NON-FANCY. PROBLEM IS RESETFORM DOES NOT CLEAR SELECTIZE ELEMENTS
                //          (https://github.com/aldeed/meteor-autoform/issues/1116)
                window.location.reload();

                 //Materialize.toast('concept successfully created!', 3000);
                 //FlowRouter.go('search');
             });
            this.done();
            return false;
        }
    }
});
