Meteor.startup(function() {
    $('body').on('click', '[data-action=logout]', function(event) {
        event.preventDefault();
        AccountsTemplates.logout();
    });
});
