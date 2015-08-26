Meteor.startup(function() {

    Meteor.Mailgun.config({
        username: 'postmaster@sandbox5714c39802c24cf9a0d73399d675a1c7.mailgun.org',
        password: '39a6a53910b1acb7b05a66ecca4ec644'
    });

    //Not in use. Legacy from boilerplate. Still here for example/resources
    Meteor.methods({
        'sendContactEmail': function(name, email, message) {
            this.unblock();

            Meteor.Mailgun.send({
                to: 'recipient@example.com',
                from: name + ' <' + email + '>',
                subject: 'New Contact Form Message',
                text: message,
                html: Handlebars.templates['contactEmail']({
                    siteURL: Meteor.absoluteUrl(),
                    fromName: name,
                    fromEmail: email,
                    message: message
                })
            });
        }
    });
});
