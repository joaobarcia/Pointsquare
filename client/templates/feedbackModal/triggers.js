Template.feedbackModal.events({
    'click #sendFeedback': function(event) {
        event.preventDefault();

        console.log();
        //var name = event.target.name.value;
        // var name = people.findOne({
        //     'email': Meteor.user().emails[0].address
        // }).name;
        // var sender = Meteor.user().emails[0].address;
        // var msg = event.target.opinion.value;
        //
        // Meteor.call('sendFeedbackEmail',
        //     'contact@pointsquare.org', sender,
        //     'Feedback Email from ' + name, msg);
        //
        // event.target.name.value = "";
        // event.target.opinion.value = "";


        toastr.info('Thanks! :)');
    }
});
