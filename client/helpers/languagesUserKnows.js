Template.registerHelper('languagesUserKnows', function() {
    if (typeof Meteor.userId() !== 'undefined' && Meteor.userId() !== null) {
        return false;
    } else {
        return Meteor.userId().knownLanguages;

    }
});
