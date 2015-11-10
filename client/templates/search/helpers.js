Template.search.helpers({
    'isConcept': function() {
        return this.type == "concept"
    },
    'isUnit': function() {
        return this.type == "content"
    },
    'nodes': function() {
        return Nodes.find({}, {
            sort: {
                'name': 1
            }
        })
    }
});
