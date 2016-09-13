AccountsTemplates.configure({
  defaultLayout: 'mainLayout',
  defaultLayoutRegions: {},
  defaultContentRegion: 'main'
});

AccountsTemplates.addField({
  _id: 'username',
  type: 'text',
  displayName: "Name",
  required: true,
  minLength: 5,
});

// AccountsTemplates.addField({
//   _id: 'languagesUserKnows',
//   template: 'extraUserRegistrationFields',
//   type: 'text',
//   displayName: 'Choose your language(s)',
//   //negativeValidation: false
// });
AccountsTemplates.addField({
  _id: 'languages',
  displayName: 'Choose your language(s)',
  type: 'text',
  template: "languages"
});

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

/*
AccountsTemplates.configureRoute('ensureSignedIn', {
    layoutTemplate: 'mainLayout'
});
*/
