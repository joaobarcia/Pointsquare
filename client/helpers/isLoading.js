Meteor.startup(function() {
    Session.set('isLoading', false);
});

Template.registerHelper('isLoading', function() {
    if (typeof Session.get('isLoading') !== "undefined") {
        if (Session.get('isLoading')) return true;
        else return false;
    } else return false;
});
