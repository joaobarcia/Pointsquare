Template.unitPage.events({
    //USER (#17:1) IS HARDCODED. MUST IMPROVE 
    'click #understood': function() {
        Meteor.call("learn", "1", Blaze.getData()["@rid"], "#27:1");
    },
    'click #notUnderstood': function() {
        Meteor.call("learn", "0", Blaze.getData()["@rid"], "#27:1");
    },
    'submit form': function(event) {
        event.preventDefault();
        var answerIsCorrect = false;
        console.log(Blaze.getData()["@rid"])
        if (this.answers.indexOf(event.target.exerciseString.value) > -1) {
            answerIsCorrect = true
        }
        if (answerIsCorrect) {
            $("#exerciseButton").removeClass("orange");
            $("#exerciseButton").removeClass("red");
            $("#exerciseButton").addClass("green");

            $("#exerciseInputText").removeClass("red-text");
            $("#exerciseInputText").addClass("green-text");

            Meteor.call("learn", "1", Blaze.getData()["@rid"], "#27:1");
        } else {
            $("#exerciseButton").removeClass("orange");
            $("#exerciseButton").removeClass("green");
            $("#exerciseButton").addClass("red");

            $("#exerciseInputText").removeClass("green-text");
            $("#exerciseInputText").addClass("red-text");

            Meteor.call("learn", "0", Blaze.getData()["@rid"], "#27:1");
        }
    }
});
