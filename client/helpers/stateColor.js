Template.registerHelper('mapToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "cyan";
    } else {
        var levelOfGreen = 4 - Math.round(stateValue * 5);
        return "green lighten-" + levelOfGreen;
    }
});
