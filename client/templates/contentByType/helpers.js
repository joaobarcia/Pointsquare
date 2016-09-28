Template.contentByTypeWrapper.helpers({
  isFirstTab: function(tabIndex) {
    if (tabIndex == 0) {
      return "disabled grey";
    } else return "blue";
  },
  isLastTab: function(tabIndex) {
    const nodeId = FlowRouter.getParam('nodeId');
    if (typeof Nodes.findOne(nodeId) !== 'undefined' && Nodes.findOne(nodeId) !== null) {
      const numberOfSections = Nodes.findOne(nodeId).content.length;
      if (tabIndex == (numberOfSections - 1)) {
        return "disabled grey";
      } else return "blue";
    }
  }
});
