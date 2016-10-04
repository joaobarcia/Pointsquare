Template.registerHelper('isHome', function() {
  // have to call watchPathChange to be reactive
  FlowRouter.watchPathChange();
  const isRouteHome = (FlowRouter.current().route.name == 'home');
  return isRouteHome;
});
