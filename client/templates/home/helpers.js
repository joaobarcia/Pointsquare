Template.home.helpers({
    mainPageExams: function() {
        var mainPageExams = Nodes.find({
            type: "exam"
        }, {
            limit: 4
        });
        return mainPageExams;
    }
});
