Template.conceptsAcquired.helpers({
    concept: function() {
        var user_rid = Session.get('currentUserRID');
        var query = {
            "class": "Concept"
        };
        query['user_dependent_info.' + user_rid + '.state'] = {
            $gt: 0.8
        };
        var sort = {
            name: 1
        };
        return knowledge.find(query, sort);
    }
});
