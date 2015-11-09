AccountsTemplates.configure({
    defaultLayout: 'mainLayout',
    defaultLayoutRegions: {},
    defaultContentRegion: 'content'
});

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    displayName: "Name",
    required: true,
    minLength: 5,
});

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

/*
AccountsTemplates.configureRoute('ensureSignedIn', {
    layoutTemplate: 'mainLayout'
});
*/
