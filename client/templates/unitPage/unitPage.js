Template.unitPage.rendered = function() {
    Session.set('callStatus','doingExercise');
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
        $('.modal-trigger').leanModal();
    });
};



Template.unitPage.events({

    'click #understood': function() {
        Session.set('callStatus', 'learning');
        Meteor.call("learn", "1", Blaze.getData()["rid"], function(error, result) {
            if (result.statusCode == 200) {
                Session.set('callStatus', 'OK');
            }
            var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
            Session.set('newConcepts', newStuff[1]);
            Session.set('newUnits', newStuff[0]);
        });
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
    },

    'click #notUnderstood': function() {
        Session.set('callStatus', 'learning');
        Meteor.call("learn", "0", Blaze.getData()["rid"], function(error, result) {
            if (result.statusCode == 200) {
                Session.set('callStatus', 'OK');
            }
            var newStuff = result.data.result[0]['value'];
            Session.set('lostConcepts', newStuff[3]);
            Session.set('lostUnits', newStuff[2]);
        });
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

            Session.set('callStatus', 'learning');
            Meteor.call("learn", "0", Blaze.getData()["@rid"], "#27:1", function(error, result) {
                if (result.statusCode == 200) {
                    Session.set('callStatus', 'OK');
                }
            });
        }
    }

});
