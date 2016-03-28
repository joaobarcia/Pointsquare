// extremely unsafe security-wise. must re-do
Template.registerHelper('userIsAuthor', function() {
    var authorsRID = _.pluck(this.authors, 'rid'); // lodash creates an array of strings which only contains the rids

    if (Meteor.userId() === null) {
        return false;
    } else {
        var currentUserRID = Session.get('currentUserRID');
        var userIsAuthor = _.includes(authorsRID, currentUserRID);
        return userIsAuthor;
    }
});
