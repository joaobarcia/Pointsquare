Template.goalReachedModal.onCreated(function() {
  $('.ui.goal-reached.modal')
    .modal({
      onHide: function() {
        const userId = Meteor.userId();
        Meteor.call('removeGoal', userId);
      }
    })
    .modal('setting', 'transition', 'scale')
    .modal('show');
});
