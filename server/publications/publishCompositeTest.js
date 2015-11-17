Meteor.publishComposite('unitPageWithStates', {
    find: function() {
        // Find top ten highest scoring posts
        return Nodes.find({
            type: 'content'
        });
    },
    children: [{
        find: function(content) {
            return TempStates.find({
                type: 'state',
                from: 'user1',
                to: content._id
            });
        }
    }],
});
