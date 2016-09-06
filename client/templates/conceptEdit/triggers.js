Template.conceptEdit.onCreated(function() {
    //console.log('conceptEdit >onCreated');
    var self = this;
    self.autorun(function() {
        var conceptId = FlowRouter.getParam('nodeId');
    });

});

Template.conceptEdit.rendered = function() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            //console.log('conceptEdit rendered > subs ready');
            Meteor.globalFunctions.needsAsJSONSession();
            var deletedNeedsSets = [];
            Session.set('deletedNeedsSets', deletedNeedsSets);
        }
    });
};

Template.conceptEditSelectBox.rendered = function() {
    this.autorun(() => {
        if (Template.instance().parent(1).subscriptionsReady()) {
            //console.log('conceptEditSelectBox rendered > subs ready');
            Meteor.globalFunctions.applySelectizeCode();
        }
    });
};

Template.conceptEdit.events({
    'click #deleteConcept': function(event) {
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
        //console.log(uniqueId());
        Session.set('needsObject', needsObject);

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


        //tempContent.splice(section, 1);
    },


});

AutoForm.hooks({
    conceptEdit: {
        onSubmit: function(doc) {
            var parameters = doc;

            var nodeId = FlowRouter.getParam('nodeId');

            Meteor.call('editNode', nodeId, parameters);


            // Handle new and edited need sets
            var needsObject = Session.get('needsObject');
            //console.log(needsObject);
            _.forEach(needsObject, function(n) {
                var setId = n['_id'];
                var needsAsArrayOfId = $('#' + setId).selectize()[0].selectize.getValue();
                var needsMappedAsArrayofObjects = {};
                for (var i = 0; i < needsAsArrayOfId.length; i += 1) {
                    needsMappedAsArrayofObjects[needsAsArrayOfId[i]] = true;
                }
                if (_(setId).startsWith('newSet')) {
                    Meteor.call('addNeed', nodeId, needsMappedAsArrayofObjects);
                } else {
                    Meteor.call('editNeed', setId, needsMappedAsArrayofObjects);
                }
            });

            // Handle deleted need sets
            var deletedNeedsSets = Session.get('deletedNeedsSets');
            for (setId of deletedNeedsSets) {
                Meteor.call('removeNeed', setId);
            }


            Materialize.toast('concept edited successfully', 3000);
            //FlowRouter.go('/concept/' + nodeId);
            this.done();
            return false;
        }
    }
});
