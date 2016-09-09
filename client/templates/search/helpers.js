Template.search.helpers({
  'isExam': function() {
      return this.type == "exam"
  },
    'isConcept': function() {
        return this.type == "concept"
    },
    'isUnit': function() {
        return this.type == "content"
    },
    nodesSearchIndex: () => NodesSearchIndex // instanceof EasySearch.Index
});
