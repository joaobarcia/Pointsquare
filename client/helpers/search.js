Template.search.helpers({
    'isConcept': function() {
        return this.class == "Concept"
    },
    'isUnit': function() {
        return this.class == "Unit"
    },
    'knowledge': function() {
        return knowledge.find({}, {
            sort: {
                'name': 1
            }
        })
    }
});
