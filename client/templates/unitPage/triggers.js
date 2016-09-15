function resetQuestionFeedback() {
  $(".trueRadioButton").removeProp('disabled').removeClass("green-text");
  $(".falseRadioButton").removeProp('disabled').removeClass("red-text");
};

function succeedUnit() {
  //definir que o utilizador já fez a sua escolha
  Session.set("outcome", "success");
  Session.set('isLoading', true);
  soundSuccess.play();
  var $toastSuccess = $('<span class="green-text">Good job!</span>');
  Materialize.toast($toastSuccess, 2000);
  //se ainda não tiverem chegado os resultados do servidor, não fazer nada
  if (Session.get("precalculation") != "waiting") {
    Meteor.call("succeed", Session.get("precalculation"), Meteor.userId(), function(e, r) {
      var goalId = Meteor.user().goal;
      if (goalId) {
        Meteor.call("setGoal", goalId, Meteor.userId(), function(e, r) {
          FlowRouter.go('/content/' + Meteor.user().nextUnit);
          Session.set('isLoading', false);
          delete Session.keys["outcome"];
          delete Session.keys["precalculation"];
        });
      } else {
        FlowRouter.go('dashboard');
        Session.set('isLoading', false);
        delete Session.keys["outcome"];
        delete Session.keys["precalculation"];
      }
      resetQuestionFeedback();
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
    Materialize.toast($toastFailWithGoal, 2000);
  } else {
    Materialize.toast($toastFailWithoutGoal, 2000);
  }
  //se ainda não tiverem chegado os resultados do servidor, não fazer nada
  if (Session.get("precalculation") != "waiting") {
    Meteor.call("fail", Session.get("precalculation"), Meteor.userId(), function(e, r) {
      var goalId = Meteor.user().goal;
      if (goalId) {
        Meteor.call("setGoal", goalId, Meteor.userId(), function(e, r) {
          if (r) {
            FlowRouter.go("/content/" + r);
          } else {
            FlowRouter.go("goalPage");
          }
          //FlowRouter.go('goalPage');
        });
      } else {
        // otherwise prompt user about setting unit as goal
        Session.set('failedUnitAndNoGoal', true);
      }
      Session.set('isLoading', false);
      delete Session.keys["outcome"];
      delete Session.keys["precalculation"];
    });
  }
  Session.set("triedUnits", {});
};

Template.unitPage.onCreated(function() {
  var nodeId = FlowRouter.getParam('nodeId');
  Meteor.call("getNeeds", nodeId, function(e, r) {
    if (typeof r !== "undefined") {
      var needs = {};
      Session.set("needs", r.sets)
    } else {
      return null
    };
  });

  Session.set("precalculation", "waiting");
  if (Meteor.userId()) {
    Meteor.call("precompute", FlowRouter.getParam('nodeId'), Meteor.userId(), function(e, r) {
      Session.set("precalculation", r);
      if (Session.get("outcome") == "success") {
        succeedUnit();
      } else if (Session.get("outcome") == "failure") {
        failUnit();
      }
    });
  };
});



Template.unitPage.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      //SET TIMEOUT NOT CORRECT, JUST TO OVERCOME LIMITATIONS IN MATERIALIZE, CHECK AGAIN LATER
      setTimeout(function() {
        $('ul.tabs').tabs();
        $('.tooltipped').tooltip({
          delay: 50
        });
      }, 20);


    }
  });
});

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
    console.log(nodeId);
    Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
      //FlowRouter.go('goalPage');
      Session.set('isLoading', false);
    });
  }

});
