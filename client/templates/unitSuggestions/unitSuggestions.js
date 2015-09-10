Template.unitSuggestions.helpers({

    unit: function() {
        var user_rid = Session.get('currentUserRID');
        var query = {
            "class": "Unit"
        };
        query['user_dependent_info.' + user_rid + '.state'] = {
            $gt: 0.8
        };
        query['user_dependent_info.' + user_rid + '.prospect'] = {
            $gt: 0.3
        };
        var sort = {};
        sort['user_dependent_info.' + user_rid + '.prospect'] = -1;
        return knowledge.find(query, sort);
    }

});
