Template.conceptPage.helpers({
    conceptPage: function() {
        var conceptId = FlowRouter.getParam('conceptId');
        var concept = Nodes.findOne({
            _id: conceptId
        }) || {};
        return concept;
    },
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
