Template.mainLayout.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('nodes');
    self.subscribe('personal');
    self.subscribe('goals');
    self.subscribe('userNames');
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
