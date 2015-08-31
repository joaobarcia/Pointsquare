Template.feedbackModal.events({
    'submit #sendFeedback': function(event) {
        //console.log(currentUser);

    },
});

Template.feedbackModal.events({
    'submit #feedbackForm': function(event) {
        event.preventDefault();

        //var name = event.target.name.value;
        var name = people.findOne({
            'email': Meteor.user().emails[0].address
        }).name;
        var sender = Meteor.user().emails[0].address;
        var msg = event.target.opinion.value;

        Meteor.call('sendFeedbackEmail',
            'joaobarcia@gmail.com', sender,
            'Feedback Email from ' + name, msg);

        event.target.name.value = "";
        event.target.opinion.value = "";

        Materialize.toast('Thanks! :)', 4000)
    }
});
