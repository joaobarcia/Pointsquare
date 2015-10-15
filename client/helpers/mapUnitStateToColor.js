Template.registerHelper('mapUnitStateToColor', function(stateValue) {
    if (!Meteor.userId()) {
        return "cyan"; // when user is not logged show neutral color cyan
    } else {
        if (stateValue >= 0 && stateValue < 0.2) return "red lighten-2"; // if concept state is low display red book
        else if (stateValue < 0.8) return "orange lighten-2"; // if concept state is intermediate display yellow book
        else if (stateValue <= 1) return "green"; // if concept state is high display green book
        else return "grey"; // any other value (state error) display grey book
    }
});
