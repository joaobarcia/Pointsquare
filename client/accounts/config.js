Meteor.startup(function() {
    if (Meteor.user()) {
        Meteor.call('get_user_rid', function(err, data) {
            if (err)
                console.log(err);

            Session.set('currentUserRID', data);
        });
    }
});

Accounts.onLogin(function() {
    Meteor.call('get_user_rid', function(err, data) {
        if (err)
            console.log(err);

        Session.set('currentUserRID', data);
    });
    woopra.identify({
        //email: "<<YOUR CUSTOMER EMAIL HERE>>",
        name: Meteor.user().username,
        email: Meteor.user().emails[0].address
    });


    // The identify code should be added before the "track()" function
    woopra.track();
});
