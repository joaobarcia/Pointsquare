Accounts.onLogin(function() {
    Meteor.call('get_user_rid', function(err, data) {
        if (err)
            console.log(err);

        Session.set('currentUserRID', data);
    });
})
