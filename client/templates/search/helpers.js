Template.search.helpers({
    'isConcept': function() {
        return this.type == "concept"
    },
    'isUnit': function() {
        return this.type == "content"
    },
    nodesSearchIndex: () => NodesSearchIndex // instanceof EasySearch.Index
});
