Template.conceptEdit.helpers({
    conceptEditSchema: function() {
        return Schema.Concept;
    },
    conceptEditDoc: function() {
        // load stored unit values and pass them with necessary modif to autoform doc 'unitEditDoc'
        var unitEditDoc = {};
        unitEditDoc.name = Template.currentData().name;
        unitEditDoc.description = Template.currentData().name;


        unitEditDoc.requiredConcepts = _.pluck(Template.currentData().requires, 'rid');
        unitEditDoc.grantedConcepts = _.pluck(Template.currentData().grants, 'rid');

        var evaluation = _.find(Template.currentData().content, {
            type: 'unitEvaluationSection'
        });
        console.log(evaluation);
        unitEditDoc.evaluationType = evaluation.evaluationType;


        unitEditDoc.exerciseRadioButton = {};
        unitEditDoc.exerciseRadioButton.question = evaluation.question;
        unitEditDoc.exerciseRadioButton.options = evaluation.options;

        unitEditDoc.exerciseString = {};
        unitEditDoc.exerciseString.question = evaluation.question;
        unitEditDoc.exerciseString.answers = evaluation.answers;

        return unitEditDoc;
    }
});
