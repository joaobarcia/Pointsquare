Meteor.startup(function() {
    $('body').on('click', '[data-action=logout]', function(event) {
        event.preventDefault();
        AccountsTemplates.logout();
    });

    // WARNING: REMOVE WHEN DEPLOY
    Session.set("godMode", true);
    Meteor.call("readyThreshold",function(e,r){
      Session.set("readyThreshold",r);
    });
});
