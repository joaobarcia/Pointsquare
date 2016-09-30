function examExercisesAsSession() {
  var examContent = Meteor.globalFunctions.getExamContent();
  //console.log(examContent);
  var unitIdsSetToFailedExercise = {};
  for (var index in examContent) {
    if (typeof examContent[index] !== 'undefined' && examContent[index] !== null) {
      var unitId = examContent[index]["_id"];
      unitIdsSetToFailedExercise[unitId] = false;
    }
  };
  Session.set("examResults", unitIdsSetToFailedExercise);
};

function succeedUnitInExam(unitId) {
  var examResults = Session.get("examResults");
  examResults[unitId] = true;
  Session.set("examResults", examResults);
};

function failUnitInExam(unitId) {
  var examResults = Session.get("examResults");
  examResults[unitId] = false;
  Session.set("examResults", examResults);
};

Template.examPage.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      examExercisesAsSession();
      Session.set("displayExamResults", false);
    }
  });
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      setTimeout(function() {
        $('.ui.checkbox').checkbox();
      }, 200);
    }
  });


});

Template.examPage.events({
  // 'submit .exerciseStringForm': function(event) {
  //     event.preventDefault();
  // },
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
        console.log(event.currentTarget);
        $(event.currentTarget).find(".exerciseStringInput").addClass("true_string");
        succeedUnitInExam(unitId);
      }
    } else if (!answerIsCorrect) {
      // $("#exerciseInputText").removeClass("green-text").addClass("red-text").attr("disabled", "disabled
      if (Meteor.userId()) {
        $(event.currentTarget).find(".exerciseStringInput").removeClass("true_string");
        failUnitInExam(unitId);
      }
    }
  },
  'change .trueRadioButton': function(event, template) {
    if (Meteor.userId()) {
      var unitId = $(event.currentTarget).attr("unit_id");
      succeedUnitInExam(unitId);
    }
  },

  'change .falseRadioButton': function(event) {
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
    $(".exerciseRadioButtonField").addClass('disabled');
    $(".trueRadioButtonLabel").addClass("green text");
    $(".falseRadioButtonLabel").addClass("red text");

    // FEEDBACK ON STRING EXERCISES
    $(".exerciseStringInputDiv").addClass("disabled");
    $(".exerciseStringInput:not(.true_string)").addClass("red text");
    $(".exerciseStringInput.true_string").addClass("green text");

    // SHOW PROGRESS AND PROPOSE GOAL
    Session.set("displayExamResults", true);

    // CALL LEARNING METHODS
    if (Meteor.userId()) {
      var examResults = Session.get("examResults");
      Session.set("isLoading", true);
      Meteor.call("submitExam", examResults, Meteor.userId(), function(e, r) {
        Session.set("isLoading", false);
        $('#exam-results-bar').progress();
      });
    }

  },


});
