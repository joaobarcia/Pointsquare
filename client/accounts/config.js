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
    console.log("client side onLogin")
    Meteor.call('get_user_rid', function(err, data) {
        if (err)
            console.log(err);

        Session.set('currentUserRID', data);
    });
    console.log("trying to woopra");
    woopra.identify({
        //email: "<<YOUR CUSTOMER EMAIL HERE>>",
        name: Meteor.user().username,
        email: Meteor.user().emails[0].address
    });


    // The identify code should be added before the "track()" function
    woopra.track();
});
