Template.unitCard.helpers({
  language: function() {
    const nodeId = this._id;
    Meteor.call("getNeeds", nodeId, function(e, r) {
      console.log(r);
    });;
    // return language;
  },
});
