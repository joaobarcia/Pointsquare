Template.conceptPage.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
};

Template.conceptPage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var conceptId = FlowRouter.getParam('nodeId');
    });
});
