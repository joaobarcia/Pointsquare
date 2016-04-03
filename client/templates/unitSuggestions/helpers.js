Template.unitSuggestions.helpers({

    unit: function() {
        var user_rid = Session.get('currentUserRID');
        var query = {
            "class": "Unit"
        };
        // query['user_dependent_info.' + user_rid + '.state'] = {
        //     $gt: 0.8
        // };
        query['user_dependent_info.' + user_rid + '.prospect'] = {$gte: 1};
        var sort = {};
        sort['user_dependent_info.' + user_rid + '.state'] = -1;
        var defs = {};
        defs['limit'] = 3;
        defs['sort'] = sort;
        return knowledge.find(query, defs);
    }

});
