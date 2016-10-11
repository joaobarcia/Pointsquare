Template.registerHelper('tooltipIfNoUser', function() {
  if (!Meteor.user()) return {
    'data-tooltip': 'Login to start tracking your knowledge',
    'data-inverted': '',
    'data-position': 'bottom left'
  }
});
