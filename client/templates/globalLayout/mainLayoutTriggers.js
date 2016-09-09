// Temporary "subscribe all" in main layout. To be replaced by template specific subscriptions
Template.mainLayout.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('nodes');
    self.subscribe('personal');
    self.subscribe('userNames');
    self.subscribe("user",Meteor.userId());
  });
  soundSuccess = new Howl({
    src: ['../audio/success.mp3'],
    buffer: true
  });
  soundFail = new Howl({
    src: ['../audio/fail.mp3'],
    buffer: true
  });
});
