Template.conceptEdit.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var conceptId = FlowRouter.getParam('conceptId');
        self.subscribe('singleConcept', conceptId);
    });
});

Template.conceptEdit.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
};


Template.conceptEdit.events({
    'click #deleteConcept': function(event) {
        event.preventDefault();
        var rid = Template.currentData().rid;
        Session.set("callStatus", "submitting concept");
        Meteor.call('removeNode', rid, function(error, result) {
            Router.go('/dashboard');
            Session.set("callStatus", "submitted");
        });
    },
});

AutoForm.hooks({
    conceptEdit: {
        onSubmit: function(doc) {
            /*console.log("Great Success!");
            console.log("rid", this.formAttributes.conceptRID);
            var conceptRID = this.formAttributes.conceptRID;
            var properties = {};
            properties.name = doc.name; // fetch autoform input as necessary by createUnit method(properties, necessary, granted)
            properties.description = "";
            if (typeof doc.description != "undefined") { // in case description has not been filled, leave blank
                properties.description = doc.description;
            };

            console.log("Properties", properties);


            var childConcepts = {};
            _.forEach(doc.childConcepts, function(n) {
                childConcepts[n] = 1
            });

            var childConceptsArray = [];
            childConceptsArray.push(childConcepts);*/


            console.log(doc);
            var parameters = {};
            parameters.name = doc.name;
            parameters.description = doc.description;
            console.log(parameters);

            var conceptId = FlowRouter.getParam('conceptId');

            Meteor.call('editNode', conceptId, parameters);


            this.done();
            return false;
        }
    }
});
