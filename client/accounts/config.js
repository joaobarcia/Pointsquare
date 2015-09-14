Meteor.startup(function() {
    if (Meteor.user() && Session.get('callStatus') != 'creatingUser') {
        console.log("a correr o on startup do rid manhoso");
        Meteor.call('get_user_rid', function(err, data) {
            if (err)
                console.log(err);

            Session.set('currentUserRID', data);
        });
    }
});

Accounts.onLogin(function() {
    if (Session.get('callStatus') != 'creatingUser') {
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
    }
});

/*Template.atForm.events({

    'click .at-btn': function(){
        Session.set('callStatus','creatingUser');
    }

});*/
