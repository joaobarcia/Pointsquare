Template._header.helpers({
  transparentIfHome: function() {
    FlowRouter.watchPathChange();
    const isRouteHome = (FlowRouter.current().route.name == 'home');
    if (isRouteHome) {
      return "transparent"
    } else {
      return "fixed"
    };
  }
});

Template._header.events({
  'click #feedback': function(event) {
    $('.ui.feedback.modal')
      .modal('setting', 'transition', 'scale')
      .modal('show');
  }
});
