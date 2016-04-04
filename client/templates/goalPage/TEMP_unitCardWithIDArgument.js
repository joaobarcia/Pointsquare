Template.TEMP_unitCardWithIDArgument.helpers({
  'returnUnit': function(unitId, options) {
    return Nodes.findOne({
      _id: unitId
    });
  }
});
