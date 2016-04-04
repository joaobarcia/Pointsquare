Template.registerHelper('state', function() {
  if (Meteor.userId()) {
    var info = Personal.findOne({
      user: Meteor.userId(),
      node: Template.currentData()._id
    });
    return info ? (info.state ? info.state : 0) : 0;
  } else return 0;
});
