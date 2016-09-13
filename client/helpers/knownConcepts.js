Template.registerHelper('knownConcepts', function() {
  if (typeof Meteor.user() !== 'undefined' && Meteor.user() !== null) {
    var knownConceptIds = Personal.find({
      user: {
        $eq: Meteor.user()._id
      },
      state: {
        $gt: Session.get("readyThreshold")
      }
    }, {
      fields: {
        'node': 1
      }
    }).map(function(doc) {
      return doc.node
    });

    var knownConcepts = Nodes.find({
      _id: {
        $in: knownConceptIds
      },
      type: "concept",
      isLanguage: {
        $ne: true
      }
    }).fetch();
    return knownConcepts;
  } else {
    return false;
  }
});
