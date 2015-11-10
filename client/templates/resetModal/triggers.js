Template.resetModal.events({
    'click #resetButton': function() {
        $("#resetButton").addClass("disabled");
        Session.set('callStatus', 'resetting');
        Meteor.call("reset", function(error, result) {
            if (result.statusCode >= 200 && result.statusCode < 300) {
                Session.set('callStatus', 'OK');
                $('#resetModal').closeModal();
                $("#resetButton").removeClass("disabled");

            }
        });
    },
});
