EasySearch.createSearchIndex('knowledge', {
    'field': ['name', 'description', 'views', 'state', 'date'],
    'collection': knowledge,
    'props': {
        'filteredClasses': ['Unit'],
        'orderBy': 'name',
        'onlyNewUnits': false,
    },
    sort: function() {
        if (this.props.orderBy) {
            if (this.props.orderBy === 'name') {
                return {
                    'name': 1
                };
            } else if (this.props.orderBy === 'views') {
                return {
                    'views': -1
                };
            } else if (this.props.orderBy === 'state') {
                currentUserRID = Session.get('currentUserRID');
                var sortQuery = {};
                sortQuery['user_dependent_info.' + currentUserRID + '.state'] = -1;
                return sortQuery;
            } else {
                return {
                    'name': 1
                };
            }
        }
    },
    'limit': 50,
    'query': function(searchString, opts) {
        if (searchString.length == 0) {
            console.log("NULLLS!")
        } else {
            console.log(searchString);
            // Default query that will be used for searching
            var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

            // filter for categories if set
            if (this.props.filteredClasses.length > 0) {
                query.class = {
                    $in: this.props.filteredClasses
                };
            };

        };
        // filter for only new units
        if (this.props.onlyNewUnits) {
            var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
            currentUserRID = Session.get('currentUserRID');
            query['user_dependent_info.' + currentUserRID + '.succeeded'] = {
                $in: [0]
            };
        };
        return query;

    }
});
