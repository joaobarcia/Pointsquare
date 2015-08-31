Template.conceptPage.helpers({
    'grantedUnit': function() {
        return knowledge.find({
            'class': 'Unit',
            'grants.rid': this.rid
        });

    },
    'requiredUnit': function() {
        return knowledge.find({
            'class': 'Unit',
            'requires.rid': this.rid
        });
    },
    'parentConcepts': function() {
        return knowledge.find({
            'class': 'Concept',
            'contains.rid': this.rid
        });

    },
    'childConcepts': function() {
        return knowledge.find({
            'class': 'Concept',
            'belongs_to.rid': this.rid
        });

    },
});
