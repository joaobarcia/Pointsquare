Template.unitCard.helpers({
  unitLanguageName: function() {
    const nodeId = this._id;
    if (typeof Meteor.globalFunctions.getNeeds(nodeId).language !== 'undefined' && Meteor.globalFunctions.getNeeds(nodeId).language !== null) {
      const languageId = Meteor.globalFunctions.getNeeds(nodeId).language;
      const languageName = Nodes.findOne(languageId).name;
      return languageName;
    }
  }
});
