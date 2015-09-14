Template.orientUserCreation.onRendered(function() {
    currentUser = Meteor.users.findOne();
    Meteor.call('create_person', currentUser.emails[0].address, currentUser.username, function(error, result) {
        if (result.statusCode >= 200 && result.statusCode < 300) {
            Session.set('callStatus', 'OK');
            Meteor.call('get_user_rid', function(err, data) {
                if (err)
                    console.log(err);

                Session.set('currentUserRID', data);
            });
            Meteor.subscribe('user_names');
            Meteor.subscribe('user_info');
            Meteor.subscribe('knowledge_network');
            //Router.go('dashboard');
        }
    });

})
