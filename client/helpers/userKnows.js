Template.registerHelper('userKnows', function() {
    if (Meteor.userId() === null) {
        return false;
    } else {
        var knownConceptIds = Personal.find({
            user: {
                $eq: Meteor.user()._id
            },
            state: {
                $gt: 0.8
            }
        }, {
            fields: {
                'node': 1
            }
        }).map(function(doc) {
            return doc.node
        });

        var knownConcepts = Nodes.find({
            _id: {
                $in: knownConceptIds
            }
        }).fetch();
        return knownConcepts;
    }
});
