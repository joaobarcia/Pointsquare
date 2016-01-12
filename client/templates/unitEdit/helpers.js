Template.unitEdit.helpers({
    contentEditPage: function() {
        var nodeId = FlowRouter.getParam('contentId');
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
    /*unitEditDoc: function() {
        // load stored unit values and pass them with necessary modif to autoform doc 'unitEditDoc'
        var unitEditDoc = {};
        unitEditDoc.name = Template.currentData().name;
        unitEditDoc.description = Template.currentData().description;


        unitEditDoc.requiredConcepts = _.pluck(Template.currentData().requires, 'rid');
        unitEditDoc.grantedConcepts = _.pluck(Template.currentData().grants, 'rid');

        var evaluation = _.find(Template.currentData().content, {
            type: 'unitEvaluationSection'
        });
        //console.log(evaluation);
        unitEditDoc.evaluationType = evaluation.evaluationType;


        unitEditDoc.exerciseRadioButton = {};
        unitEditDoc.exerciseRadioButton.question = evaluation.question;
        unitEditDoc.exerciseRadioButton.options = evaluation.options;

        unitEditDoc.exerciseString = {};
        unitEditDoc.exerciseString.question = evaluation.question;
        unitEditDoc.exerciseString.answers = evaluation.answers;

        return unitEditDoc;
    },*/
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
