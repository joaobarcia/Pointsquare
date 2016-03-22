Template.registerHelper('authorsInfo', function(authors) {
  if (typeof authors !== "undefined") {
    var authorsIds = Object.keys(authors);
    var authorsInfo = Meteor.users.find({
      "_id": {
        "$in": authorsIds
      }
    }).fetch();
    return authorsInfo;
  } else return null;
});
