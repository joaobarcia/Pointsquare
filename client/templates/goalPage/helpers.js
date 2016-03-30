Template.goalPage.helpers({
  isCompleted: function() {
      return Session.get("goalCompleted");
  }
});
