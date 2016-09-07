function examExercisesAsSession() {
    var examContent = Meteor.globalFunctions.getExamContent();
    //console.log(examContent);
    var unitIdsSetToFailedExercise = {};
    for (var index in examContent) {
        var unitId = examContent[index]["_id"];
        unitIdsSetToFailedExercise[unitId] = false;
    };
    Session.set("examResults", unitIdsSetToFailedExercise);
};

function succeedUnitInExam(unitId) {
    console.log("true");
    var examResults = Session.get("examResults");
    examResults[unitId] = true;
    Session.set("examResults", examResults);
};

function failUnitInExam(unitId) {
    console.log("false");
    var examResults = Session.get("examResults");
    examResults[unitId] = false;
    Session.set("examResults", examResults);
};

Template.examPage.onRendered(function() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            $('.tooltipped').tooltip({
                delay: 20
            });
            examExercisesAsSession();
        }
    });
});

Template.examPage.events({
    'submit .exerciseStringForm': function(event) {
        event.preventDefault();
    },
    'change .exerciseStringForm': function(event) {
        event.preventDefault();
        var answerIsCorrect = null;
        if (this.answers.indexOf(event.target.value) > -1) {
            answerIsCorrect = true;
        } else answerIsCorrect = false;
        var unitId = this.unitId;
        if (answerIsCorrect) {
            // $("#exerciseInputText").removeClass("red-text").addClass("green-text").attr("disabled", "disabled");
            if (Meteor.userId()) {
                $(event.currentTarget).children("input").addClass("true_string");
                succeedUnitInExam(unitId);
            }
        } else if (!answerIsCorrect) {
            // $("#exerciseInputText").removeClass("green-text").addClass("red-text").attr("disabled", "disabled
            if (Meteor.userId()) {
                $(event.currentTarget).children("input").removeClass("true_string");
                failUnitInExam(unitId);
            }
        }
    },
    'change .trueRadioButton': function(event, template) {
        // $(".trueRadioButton").prop('disabled', 'disabled');
        // $(".falseRadioButton").prop('disabled', 'disabled');
        // $(".trueRadioButtonLabel").addClass("green-text");
        // $(".falseRadioButtonLabel").addClass("red-text");
        if (Meteor.userId()) {
            var unitId = $(event.currentTarget).attr("unit_id");
            succeedUnitInExam(unitId);
        }
    },

    'change .falseRadioButton': function(event) {
        // $(".trueRadioButton").prop('disabled', 'disabled');
        // $(".falseRadioButton").prop('disabled', 'disabled');
        // $(".trueRadioButtonLabel").addClass("green-text");
        // $(".falseRadioButtonLabel").addClass("red-text");
        if (Meteor.userId()) {
            var unitId = $(event.currentTarget).attr("unit_id");
            failUnitInExam(unitId);
        }
    },
    // 'click .set-goal': function(event, template) {
    //     Session.set('isLoading', true);
    //     event.preventDefault();
    //     var nodeId = FlowRouter.getParam('nodeId');
    //     console.log(nodeId);
    //     Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
    //         FlowRouter.go('goalPage');
    //         Session.set('isLoading', false);
    //     });
    // }
    'click #submit_exam': function(event) {
        console.log("SUBMIT EXAM!");

        // FEEDBACK ON RADIO BUTTON EXERCISES
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");

        // FEEDBACK ON STRING EXERCISES
        $(".exerciseStringForm:not(.true_string)").addClass("red-text").attr("disabled", "disabled");
        $(".exerciseStringForm .true_string").addClass("green-text").attr("disabled", "disabled");
    },


});
