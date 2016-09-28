Template.examCard.helpers({
  examLanguagesNames: function() {
    const nodeId = this._id;
    if (typeof Meteor.globalFunctions.getNeeds(nodeId) !== 'undefined' && Meteor.globalFunctions.getNeeds(nodeId) !== null) {
      const languagesIds = Object.keys(Meteor.globalFunctions.getNeeds(nodeId).languages);
      // console.log(languagesIds);
      var examLanguagesNames = [];
      for (let id of languagesIds){
        examLanguagesNames.push(Nodes.findOne(id).name);
      }
      console.log(examLanguagesNames);
      return examLanguagesNames
    }
  }
});
