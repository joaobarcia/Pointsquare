Template.feedbackModal.events({
    'submit #sendFeedback': function(event) {
        //console.log(currentUser);

    },
});

Template.feedbackModal.events({
    'submit #feedbackForm': function(event) {
        event.preventDefault();

        var name = event.target.name.value;
        var sender = Meteor.user().emails[0].address;
        var msg = event.target.opinion.value;

        Meteor.call('sendFeedbackEmail',
            'joaobarcia@gmail.com', sender,
            'Feedback Email from ' + name, msg);

        event.target.name.value = "";
        event.target.opinion.value = "";

        Materialize.toast('Thanks! :)', 4000)

        //firstname = template.find("input[name=firstname]");
        //lastname = template.find("input[name=lastname]");
        //email = template.find("input[name=email]");

        // Do form validation

        //var data = {
        //    firstname: firstname.value,
        //    lastname: lastname.value,
        //    email: email.value
        //};
        //
        //        email.value = "";
        //        firstname.value = "";
        //        lastname.value = "";
        //
        //        MyCollection.insert(data, function(err) { /* handle error */ });

    }
});
