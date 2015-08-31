Template.unitPage.helpers({
    isType: function(type) {
        return this.type == type //true or false;
    },
    grantedConcepts: function() {
        return knowledge.find({
            'class': 'Concept',
            'granted_by.rid': this.rid
        });
    },
    requiredConcepts: function() {
        return knowledge.find({
            'class': 'Concept',
            'required_for.rid': this.rid
        });
    }
});
