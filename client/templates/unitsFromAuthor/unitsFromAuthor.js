Template.unitsFromAuthor.helpers({
    unitFromAuthor: function() {
        var currentUserRID = Session.get('currentUserRID');

        return knowledge.find({
            "class": "Unit",
            "authors.rid": currentUserRID
        }).fetch();
    }

});
