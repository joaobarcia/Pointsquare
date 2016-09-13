Template.registerHelper('mapUnitStateToTooltipMsg', function(stateValue) {
    if (!Meteor.userId()) {
        return "Login to see if this unit is suitable for you"; // when user is not logged
    } else {
        if (stateValue >= 0 && stateValue < Session.get("ready threshold")) return "Unit might be too hard for you"; // if concept state is low
        else if (stateValue < Session.get("ready threshold")) return "Unit might be right for you"; // if concept state is intermediate
        else if (stateValue <= 1) return "Unit is at the right level for you"; // if concept state is high
        else return "grey"; // any other value (state error) display
    }
});
