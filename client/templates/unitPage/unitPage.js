Template.unitPage.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
    $('.modal-trigger').leanModal();
};



Template.unitPage.events({
    'click #understood': function() {
        Meteor.call("learn", "1", Blaze.getData()["rid"]);
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
    },
    'click #notUnderstood': function() {
        Meteor.call("learn", "0", Blaze.getData()["rid"]);
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
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
