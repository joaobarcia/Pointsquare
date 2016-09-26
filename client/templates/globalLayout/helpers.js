Template.mainLayout.helpers({
  bottomPaddingIfGoalBar: function() {
    const goalExists = Blaze._globalHelpers.goalExists();
    if (goalExists) {
      return "bottom-padding-for-goalbar";
    } else return "";
  }
});
