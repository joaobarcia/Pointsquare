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
});
