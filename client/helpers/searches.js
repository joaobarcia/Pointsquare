Template.searchUnit.helpers({
    'unit': function() {
        return Units.find()
    }
});

Template.searchConcept.helpers({
    'concept': function() {
        return Concepts.find()
    }
});