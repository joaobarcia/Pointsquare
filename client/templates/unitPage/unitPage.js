Template.unitPage.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
    $(document).ready(function() {
        $('ul.tabs').tabs();
    });
};




Template.unitPage.events({
    'click #understood': function(event) {
        event.preventDefault();
        Session.set('callStatus', 'learning');
        if( Session.get("temp")=="ready" ){
            Meteor.call("succeed",Blaze.getData()["rid"], function(error, result) {
                console.log(result.statusCode);
                if (result.statusCode >= 200 && result.statusCode < 300) {
                    Session.set('callStatus', 'learned');
                }
                var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
                Session.set('newConcepts', newStuff[1]);
                Session.set('newUnits', newStuff[0]);
            });
        }
        else if( Session.get("temp")=="precomputing" ){
            console.log("nothing");
        }
        // Meteor.call("succeed",Blaze.getData()["rid"], function(error, result) {
        //     console.log(result.statusCode);
        //     if (result.statusCode >= 200 && result.statusCode < 300) {
        //         Session.set('callStatus', 'learned');
        //     }
        //     var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
        //     Session.set('newConcepts', newStuff[1]);
        //     Session.set('newUnits', newStuff[0]);
        // });
        // Meteor.call("learn", "1", Blaze.getData()["rid"], function(error, result) {
        //     console.log(result.statusCode);
        //     if (result.statusCode >= 200 && result.statusCode < 300) {
        //         Session.set('callStatus', 'learned');
        //     }
        //     var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
        //     Session.set('newConcepts', newStuff[1]);
        //     Session.set('newUnits', newStuff[0]);
        // });
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
    },

    'click #notUnderstood': function(event) {
        event.preventDefault();
        Session.set('callStatus', 'unlearning');
        if( Session.get("temp")=="ready" ){
            Meteor.call("fail",Blaze.getData()["rid"], function(error, result) {
                console.log(result.statusCode);
                if (result.statusCode >= 200 && result.statusCode < 300) {
                    Session.set('callStatus', 'unlearned');
                }
                var newStuff = result.data.result[0]['value'];
                Session.set('lostConcepts', newStuff[3]);
                Session.set('lostUnits', newStuff[2]);
            });
        }
        else if( Session.get("temp")=="precomputing" ){
            console.log("nothing");
        }
        // Meteor.call("fail",Blaze.getData()["rid"], function(error, result) {
        //     console.log(result.statusCode);
        //     if (result.statusCode >= 200 && result.statusCode < 300) {
        //         Session.set('callStatus', 'unlearned');
        //     }
        //     var newStuff = result.data.result[0]['value'];
        //     Session.set('lostConcepts', newStuff[3]);
        //     Session.set('lostUnits', newStuff[2]);
        // });
        // Meteor.call("learn", "0", Blaze.getData()["rid"], function(error, result) {
        //     if (result.statusCode >= 200 && result.statusCode < 300) {
        //         Session.set('callStatus', 'unlearned');
        //     }
        //     var newStuff = result.data.result[0]['value'];
        //     Session.set('lostConcepts', newStuff[3]);
        //     Session.set('lostUnits', newStuff[2]);
        // });
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
    },

    'submit #exerciseStringForm': function(event) {
        event.preventDefault();
        var answerIsCorrect = null;
        console.log(this);
        console.log(Blaze.getData()["rid"]);
        console.log(event.target.exerciseString.value);
        console.log(this.answers);
        console.log(this.answers.indexOf(event.target.exerciseString.value) > -1);
        if (this.answers.indexOf(event.target.exerciseString.value) > -1) {
            answerIsCorrect = true
        } else answerIsCorrect = false;
        if (answerIsCorrect) {
            $("#exerciseButton").removeClass("orange red").addClass("green");
            $("#exerciseInputText").removeClass("red-text").addClass("green-text");
            setTimeout(function() {
                Session.set('callStatus', 'learning')
            }, 4000);
            Meteor.call("succeed",Blaze.getData()["rid"], function(error, result) {
                console.log(result.statusCode);
                if (result.statusCode >= 200 && result.statusCode < 300) {
                    Session.set('callStatus', 'learned');
                }
                var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
                Session.set('newConcepts', newStuff[1]);
                Session.set('newUnits', newStuff[0]);
            });
            // Meteor.call("learn", "1", Blaze.getData()["rid"], function(error, result) {
            //     console.log(result.statusCode);
            //     if (result.statusCode >= 200 && result.statusCode < 300) {
            //         Session.set('callStatus', 'learned');
            //     }
            //     var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
            //     Session.set('newConcepts', newStuff[1]);
            //     Session.set('newUnits', newStuff[0]);
            // });
            //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
            Meteor.call("incrementViews", Blaze.getData()["rid"]);
        } else if (!answerIsCorrect) {
            $("#exerciseButton").removeClass("orange");
            $("#exerciseButton").removeClass("green");
            $("#exerciseButton").addClass("red");

            $("#exerciseInputText").removeClass("green-text");
            $("#exerciseInputText").addClass("red-text");

            Session.set('callStatus', 'unlearning');
            Meteor.call("fail",Blaze.getData()["rid"], function(error, result) {
                console.log(result.statusCode);
                if (result.statusCode >= 200 && result.statusCode < 300) {
                    Session.set('callStatus', 'unlearned');
                }
                var newStuff = result.data.result[0]['value'];
                Session.set('lostConcepts', newStuff[3]);
                Session.set('lostUnits', newStuff[2]);
            });
            // Meteor.call("learn", "0", Blaze.getData()["rid"], function(error, result) {
            //     if (result.statusCode >= 200 && result.statusCode < 300) {
            //         Session.set('callStatus', 'unlearned');
            //     }
            //     var newStuff = result.data.result[0]['value'];
            //     Session.set('lostConcepts', newStuff[3]);
            //     Session.set('lostUnits', newStuff[2]);
            // });
            //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
            Meteor.call("incrementViews", Blaze.getData()["rid"]);
        }
    },
    'change .trueRadioButton': function(event) {
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");
        setTimeout(function() {
            Session.set('callStatus', 'learning')
        }, 4000);
        Meteor.call("learn", "1", Blaze.getData()["rid"], function(error, result) {
            console.log(result.statusCode);
            if (result.statusCode >= 200 && result.statusCode < 300) {
                Session.set('callStatus', 'learned');
            }
            var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
            Session.set('newConcepts', newStuff[1]);
            Session.set('newUnits', newStuff[0]);
        });
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
    },

    'change .falseRadioButton': function(event) {
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");
        setTimeout(function() {
            Session.set('callStatus', 'unlearning')
        }, 4000);
        Meteor.call("learn", "0", Blaze.getData()["rid"], function(error, result) {
            if (result.statusCode >= 200 && result.statusCode < 300) {
                Session.set('callStatus', 'unlearned');
            }
            var newStuff = result.data.result[0]['value'];
            Session.set('lostConcepts', newStuff[3]);
            Session.set('lostUnits', newStuff[2]);
        });
        //Materialize.toast('Give us a few seconds to propagate your knowledge', 5000);
        Meteor.call("incrementViews", Blaze.getData()["rid"]);
    },
    'click #backToUnit': function(event) {
        event.preventDefault();
        Session.set('callStatus', 'doingExercise');
        console.log(Session.get('callStatus'));
    },

});
