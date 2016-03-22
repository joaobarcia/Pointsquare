Template.dashboard.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('nodes');
        self.subscribe('personal');
        self.subscribe('goals');
    });
});
