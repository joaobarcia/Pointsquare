AccountsTemplates.configure({
  defaultLayout: 'mainLayout',
  defaultLayoutRegions: {},
  defaultContentRegion: 'main',
  showForgotPasswordLink: true,
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


AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp', {
    redirect: '/dashboard',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password'
});

/*
AccountsTemplates.configureRoute('ensureSignedIn', {
    layoutTemplate: 'mainLayout'
});
*/
