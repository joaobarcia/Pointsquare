knowledge = new Mongo.Collection('knowledge');

EasySearch.createSearchIndex('knowledge', {
    'field': ['name', 'description', 'views', 'state', 'date'],
    'collection': knowledge,
    'props': {
        'filteredClasses': [],
        'orderBy': 'name'
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
            } else {
                return {
                    'name': 1
                };
            }
        }
    },
    'limit': 50,
    'query': function(searchString) {
        // Default query that will be used for searching
        var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

        // filter for categories if set
        if (this.props.filteredClasses.length > 0) {
            query.class = {
                $in: this.props.filteredClasses
            };
        }
        console.log(query);
        return query;
    }
});
