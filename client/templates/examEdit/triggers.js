Template.examEdit.onCreated(function() {
    //console.log('conceptEdit >onCreated');
    var self = this;
    self.autorun(function() {
        var examId = FlowRouter.getParam('nodeId');
    });
});
