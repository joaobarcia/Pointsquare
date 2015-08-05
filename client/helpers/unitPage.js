Template.unitPage.helpers({
    isType: function(type) {
        return this.type == type //true or false;
    },
    grantedConcepts: function() {
        return Concepts.find({
            '@rid': {
                $in: this.out
            }
        })
    },
    requiredConcepts: function() {
        return Concepts.find({
            '@rid': {
                $in: this.in
            }
        })
    }
});
