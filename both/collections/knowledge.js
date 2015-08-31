knowledge = new Mongo.Collection('knowledge');

EasySearch.createSearchIndex('knowledge', {
    'field': ['name', 'description'],
    'collection': knowledge,
    'props': {
        'filteredClasses': []
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
