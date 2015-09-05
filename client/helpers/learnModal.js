Template.learnModal.helpers({
    'learnedConcept': function() {
        return knowledge.find({
            'class': 'Concept'
        }, {
            limit: 3
        });
    }
});
