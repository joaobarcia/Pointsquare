Meteor.methods({
    sendFeedbackEmail: function(to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Meteor.Mailgun.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    }
});
