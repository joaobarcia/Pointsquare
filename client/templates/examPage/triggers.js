function examExercisesAsSession() {
    var examContent = Meteor.globalFunctions.getExamContent();
    console.log(examContent);
    var unitIdsSetToFailedExercise = {};
    for (var index in examContent) {
        var unitId = examContent[index]["_id"];
        unitIdsSetToFailedExercise[unitId] = false;
    };
    Session.set("examResults", unitIdsSetToFailedExercise);
};

function succeedUnitInExam(unitId) {
    var examResults = Session.get("examResults");
    examResults[unitId] = true;
    Session.set("examResults", examResults);
};

Template.examPage.onRendered(function() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            $('.tooltipped').tooltip({
                delay: 20
            });
            $('.modal-trigger').leanModal();
            examExercisesAsSession();
        }
    });
});

Template.examPage.events({
    'submit #exerciseStringForm': function(event) {
        event.preventDefault();
        var answerIsCorrect = null;
        if (this.answers.indexOf(event.target.exerciseString.value) > -1) {
            answerIsCorrect = true;
        } else answerIsCorrect = false;
        if (answerIsCorrect) {
            $("#exerciseButton").removeClass("orange red").addClass("green");
            $("#exerciseInputText").removeClass("red-text").addClass("green-text").attr("disabled", "disabled");
            if (Meteor.userId()) {
                var unitId = this.unitId;
                succeedUnitInExam(unitId);
            }
        } else if (!answerIsCorrect) {
            $("#exerciseButton").removeClass("orange").removeClass("green").addClass("red");
            $("#exerciseInputText").removeClass("green-text").addClass("red-text").attr("disabled", "disabled");
            if (Meteor.userId()) {
                //failUnit();
            }
        }
    },
    'change .trueRadioButton': function(event, template) {
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");
        if (Meteor.userId()) {
          console.log(this);
          console.log(Template.currentData());
          console.log(Template.parentData(1));
          console.log(Template.parentData(2));
          console.log(Template.parentData(3));
          console.log(Template.parentData(4));
          var unitId = this.unitId;
          succeedUnitInExam(unitId);
        }
    },

    'change .falseRadioButton': function(event) {
        $(".trueRadioButton").prop('disabled', 'disabled');
        $(".falseRadioButton").prop('disabled', 'disabled');
        $(".trueRadioButtonLabel").addClass("green-text");
        $(".falseRadioButtonLabel").addClass("red-text");
        if (Meteor.userId()) {
            console.log("Another one bites the dust!");
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


});
