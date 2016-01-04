Template.conceptEdit.helpers({
    conceptEditPage: function() {
        var conceptId = FlowRouter.getParam('conceptId');
        var concept = Nodes.findOne({
            _id: conceptId
        }) || {};
        return concept;
    },
    conceptEditSchema: function() {
        return Schema.Concept;
    },
    conceptEditDoc: function() {
        // load stored concept values and pass them with necessary modif to autoform doc 'conceptEditDoc'
        var conceptEditDoc = {};
        conceptEditDoc.name = Template.currentData().name;
        conceptEditDoc.description = Template.currentData().description;


        conceptEditDoc.childConcepts = _.pluck(Template.currentData().contains, 'rid');

        return conceptEditDoc;
    },
    needs: function() {
        var id = FlowRouter.getParam('conceptId');
        console.log(Requirements.find({
            node: id
        }).fetch());
        return Requirements.find({
            node: id
        });

    },
    needsForAutoform: function() {
        // Tem de ficar formatado em [[Set de conceitos 1],[Set de conceitos 2],[Set de conceitos 3]]
        // Em que Set de conceitos é formatado [{conceito 1.a},{conceito 1.b},{conceito 1.3}]
        // Em que conceito é formatado {label:"nome de conceito", value: "id de conceito"}
    }
});
