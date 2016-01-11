/*EasySearch.createSearchIndex('nodes', {
    'field': ['name', 'description', 'views', 'state', 'date'],
    'collection': Nodes,
    'props': {
        'filteredClasses': ['content'],
        'orderBy': 'name',
        'onlyNewUnits': false,
        'onlyHighProspect': false,
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
    'limit': 10,
    'query': function(searchString, opts) {
        // Default query that will be used for searching
        var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

        // filter for categories if set
        if (this.props.filteredClasses.length > 0) {
            query.type = {
                $in: this.props.filteredClasses
            };
        };

        // filter for only new units
        if (this.props.onlyNewUnits) {
            currentUserRID = Session.get('currentUserRID');
            query['user_dependent_info.' + currentUserRID + '.succeeded'] = {
                $not: {
                    $gt: 0
                }

            };
        };
        if (this.props.onlyHighProspect) {
            currentUserRID = Session.get('currentUserRID');
            query['user_dependent_info.' + currentUserRID + '.prospect'] = {
                $not: {
                    $lt: 0.5
                }
            };
        };
        return query;

    }
});*/


NodesSearchIndex = new EasySearch.Index({
    // index level configuration
    collection: Nodes,
    fields: ['name', 'description'],
    engine: new EasySearch.MongoDB({
        /*beforePublish: function(action, doc) {
            // might be that the field is already published and it's being modified
            if (!doc.state) {
                var userEdge = Knowledge.findOne({
                    to: doc._id
                });
                if (!userEdge) {
                    doc.state = 0;
                } else doc.state = userEdge.value;

            };
            console.log(doc.name + ":" + doc.state);
            return doc;
        },*/
        selector: function(searchObject, options, aggregation) {
            var selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

            // filter for the brand if set
            if (options.search.props.type) {
                selector.type = options.search.props.type;
            };
            return selector;
        },
        //        sort: function(searchObject, options) {
        /*sort: function() {
            return {
                state: 1
            }
        }, */
    })
});
