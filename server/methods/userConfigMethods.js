Meteor.methods({
  setUserName: function(newUserName) {
    Accounts.setUsername(Meteor.userId(), newUserName);
  },
})
