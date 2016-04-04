Template.TEMP_unitCardWithIDArgument.helpers({
  'returnUnit': function(unitId, options) {
    console.log(unitId);
    return Nodes.findOne({
      _id: unitId
    });
  }
});
