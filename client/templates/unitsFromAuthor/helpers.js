Template.unitsFromAuthor.helpers({

    unitFromAuthor: function() {
        var query = { type: "content" };
        query["authors."+Meteor.userId()] = true;
        return Nodes.find(query);
    }

});
