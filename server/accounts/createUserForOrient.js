Accounts.onCreateUser(function(options, user) {
    Meteor.call('create_person', user.emails[0].address, user.username);
    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;
    return user;
});
