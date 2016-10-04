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
