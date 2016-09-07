Template.registerHelper('isGodMode', function() {
    if (Session.get('godMode')) {
        return true
    } else return false;
});
