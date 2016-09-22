var precompute = function(nodeId) {
  if (Meteor.userId()) {
    Session.set("precalculation", "waiting");
    var r = Meteor.globalFunctions.precompute(nodeId);
    Session.set("precalculation", r);
    if (Session.get("outcome") == "success") {
      succeedUnit();
    } else if (Session.get("outcome") == "failure") {
      failUnit();
    }
  };
};

function resetQuestionFeedback() {
  // reset radio button elements
  $(":radio").prop("checked", false);
  $(".trueRadioButton").prop('disabled', false)
  $(".trueRadioButtonLabel").removeClass("green-text");
  $(".falseRadioButton").prop('disabled', false)
  $(".falseRadioButtonLabel").removeClass("red-text");
};

var succeedUnit = function() {
  //definir que o utilizador já fez a sua escolha
  Session.set("outcome", "success");
  Session.set('isLoading', true);
  soundSuccess.play();
  var $toastSuccess = $('<span class="green-text">Good job!</span>');
  //Materialize.toast($toastSuccess, 2000);
  //se ainda não tiverem chegado os resultados do servidor, não fazer nada
  if (Session.get("precalculation") != "waiting") {
    Meteor.call("succeed", Session.get("precalculation"), Meteor.userId(), function(e, r) {
      var goalId = Meteor.user().goal;
      //do not accept this unit as a next unit towards goal
      var neglectThisUnit = {};
      neglectThisUnit[FlowRouter.getParam('nodeId')] = true;
      if (goalId) {
        var goal = {}; goal[goalId] = true;
        var nextUnit = Meteor.globalFunctions.findUsefulContent(goal,neglectThisUnit);
        resetQuestionFeedback();
        FlowRouter.go('/content/' + nextUnit);
        Session.set('isLoading', false);
        delete Session.keys["outcome"];
        delete Session.keys["precalculation"];
        precompute(FlowRouter.getParam('nodeId'));
        Meteor.call("setGoal", goalId, nextUnit);
      } else {
        FlowRouter.go('/dashboard');
        Session.set('isLoading', false);
        delete Session.keys["outcome"];
        delete Session.keys["precalculation"];
      }
    });
  }
  Session.set("triedUnits", {});
};

function failUnit() {
  //definir que o utilizador já fez a sua escolha
  Session.set('isLoading', true);
  Session.set("outcome", "failure");
  soundFail.play();
  var $toastFailWithGoal = $('<span class="red-text">Try another unit next</span>');
  var $toastFailWithoutGoal = $('<span class="red-text">Try setting this unit as goal!</span>');
  // if goal exists
  if (typeof Meteor.user().goal !== "undefined") {
    //Materialize.toast($toastFailWithGoal, 2000);
  } else {
    //Materialize.toast($toastFailWithoutGoal, 2000);
  }
  //se ainda não tiverem chegado os resultados do servidor, não fazer nada
  if (Session.get("precalculation") != "waiting") {
    Meteor.call("fail", Session.get("precalculation"), Meteor.userId(), function(e, r) {
      var goalId = Meteor.user().goal;
      //do not accept this unit as a next unit towards goal
      var neglectThisUnit = {};
      neglectThisUnit[FlowRouter.getParam('nodeId')] = true;
      if (goalId) {
        var goal = {}; goal[goalId] = true;
        var nextUnit = Meteor.globalFunctions.findUsefulContent(goal,neglectThisUnit);
        if(nextUnit){
          Meteor.call("setGoal", goalId, nextUnit);
          resetQuestionFeedback();
          FlowRouter.go('/content/' + nextUnit);
          Session.set('isLoading', false);
          delete Session.keys["outcome"];
          delete Session.keys["precalculation"];
          precompute(FlowRouter.getParam('nodeId'));
        }
        else{
          FlowRouter.go('/dashboard');
        }
      } else {
        Session.set('isLoading', false);
        delete Session.keys["outcome"];
        delete Session.keys["precalculation"];
        // otherwise prompt user about setting unit as goal
        Session.set('failedUnitAndNoGoal', true);
      }
    });
  };
  Session.set("triedUnits", {});
};

Template.unitPage.onCreated(function() {
  precompute(FlowRouter.getParam('nodeId'));
  var nodeId = FlowRouter.getParam('nodeId');
  Meteor.call("getNeeds", nodeId, function(e, r) {
    if (typeof r !== "undefined") {
      var needs = {};
      Session.set("needs", r.sets)
    } else {
      return null
    };
  });
});

Template.unitPage.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      //WARNING: SET TIMEOUT NOT CORRECT, JUST TO OVERCOME LIMITATIONS, CHECK AGAIN LATER
      setTimeout(function() {
        $('.ui.embed').embed();
        $('.unit-tabs .item').tab();
        // set first tab as active
        $("[data-tab=1]").addClass('active');
      }, 20);


    }
  });
});

Template.unitPage.onRendered(function() {
  Tracker.autorun(function() {
    $('[data-tooltip]').popup();
  });
})

Template.unitContent.onCreated(function() {
  Session.set('failedUnitAndNoGoal', false);
});

Template.unitContent.onDestroyed(function() {
  Session.set('failedUnitAndNoGoal', false);
});

Template.unitPage.events({
  'click #understood': function(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      succeedUnit();
    }
  },

  'click #notUnderstood': function(event) {
    event.preventDefault();
    if (Meteor.userId()) {
      failUnit();
    }
  },

  'submit .exerciseStringForm': function(event) {
    event.preventDefault();
    var answerIsCorrect = null;
    if (this.answers.indexOf(event.target.exerciseString.value) > -1) {
      answerIsCorrect = true;
    } else answerIsCorrect = false;
    if (answerIsCorrect) {
      $("#exerciseButton").removeClass("orange red").addClass("green");
      $("#exerciseInputText").removeClass("red-text").addClass("green-text");
      if (Meteor.userId()) {
        succeedUnit();
      }
    } else if (!answerIsCorrect) {
      $("#exerciseButton").removeClass("orange");
      $("#exerciseButton").removeClass("green");
      $("#exerciseButton").addClass("red");
      $("#exerciseInputText").removeClass("green-text");
      $("#exerciseInputText").addClass("red-text");
      if (Meteor.userId()) {
        failUnit();
      }
    }
  },
  'change .trueRadioButton': function(event) {
    $(".trueRadioButton").prop('disabled', 'disabled');
    $(".falseRadioButton").prop('disabled', 'disabled');
    $(".trueRadioButtonLabel").addClass("green-text");
    $(".falseRadioButtonLabel").addClass("red-text");
    if (Meteor.userId()) {
      succeedUnit();
    }
  },

  'change .falseRadioButton': function(event) {
    $(".trueRadioButton").prop('disabled', 'disabled');
    $(".falseRadioButton").prop('disabled', 'disabled');
    $(".trueRadioButtonLabel").addClass("green-text");
    $(".falseRadioButtonLabel").addClass("red-text");
    if (Meteor.userId()) {
      failUnit();
    }
  },
  'click .set-goal': function(event, template) {
    Session.set('isLoading', true);
    event.preventDefault();
    var nodeId = FlowRouter.getParam('nodeId');
    var goal = {}; goal[nodeId] = true;
    var nextUnit = Meteor.globalFunctions.findUsefulContent(goal);
    Meteor.call("setGoal", nodeId, nextUnit);
    Session.set('isLoading', false);
  }

});
