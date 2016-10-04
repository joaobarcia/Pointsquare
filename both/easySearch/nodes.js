NodesSearchIndex = new EasySearch.Index({
  // index level configuration
  collection: Nodes,
  fields: ['name', 'description', 'authors', 'created_on'],
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
      if (selector.type == 'content') {
        selector.isUnitFromModule = false;
      }
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
