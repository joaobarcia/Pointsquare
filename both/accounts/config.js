AccountsTemplates.configureRoute('signIn', {
    layoutTemplate: 'appLayout',
    redirect: '/dashboard',
});
AccountsTemplates.configureRoute('signUp', {
    layoutTemplate: 'appLayout',
    redirect: function() {
        Session.set('callStatus', 'creatingUser');
        Router.go('dashboard');
    }
});

AccountsTemplates.configureRoute('ensureSignedIn', {
    layoutTemplate: 'appLayout'
});
AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    displayName: "Name",
    required: true,
    minLength: 5,
});
