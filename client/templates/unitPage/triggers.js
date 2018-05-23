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
  toastr.success('Good job!');
  //se ainda não tiverem chegado os resultados do servidor, não fazer nada
  if (Session.get("precalculation") != "waiting") {
    delete Session.keys["outcome"];
    Meteor.call("succeed", Session.get("precalculation"), Meteor.userId(), function(e, r) {
      delete Session.keys["precalculation"];
      var goalId = Meteor.user().goal;
      //do not accept this unit as a next unit towards goal
      var neglectThisUnit = {};
      neglectThisUnit[FlowRouter.getParam('nodeId')] = true;
      if (goalId) {
        var goal = {};
        goal[goalId] = true;
        //se o objectivo tiver sido alcançado seguir para a sua página
        if (Meteor.globalFunctions.getState(goalId) > 0.5) {
          Session.set('isLoading', false);
          goalType = Nodes.findOne(goalId).type;
          if(goalType == "exam"){
            FlowRouter.go("/exam/"+goalId);
          }
        }
        else{
          var nextUnit = Meteor.globalFunctions.findUsefulContent(goal, neglectThisUnit);
          resetQuestionFeedback();
          Session.set('isLoading', false);
          FlowRouter.go('/content/' + nextUnit);
          precompute(nextUnit);
          Meteor.call("setGoal", goalId, nextUnit);
        }
      } else {
        //FlowRouter.go('/dashboard');
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
  // var $toastFailWithGoal = $('<span class="red-text">Try another unit next</span>');
  // var $toastFailWithoutGoal = $('<span class="red-text">Try setting this unit as goal!</span>');
  // // if goal exists
  // if (typeof Meteor.user().goal !== "undefined") {
  //   //Materialize.toast($toastFailWithGoal, 2000);
  // } else {
  //   //Materialize.toast($toastFailWithoutGoal, 2000);
  // }
  //se ainda não tiverem chegado os resultados do servidor, não fazer nada
  if (Session.get("precalculation") != "waiting") {
    delete Session.keys["outcome"];
    Meteor.call("fail", Session.get("precalculation"), Meteor.userId(), function(e, r) {
      delete Session.keys["precalculation"];
      var goalId = Meteor.user().goal;
      //do not accept this unit as a next unit towards goal
      var neglectThisUnit = {};
      neglectThisUnit[FlowRouter.getParam('nodeId')] = true;
      if (goalId) {
        var goal = {};
        goal[goalId] = true;
        var nextUnit = Meteor.globalFunctions.findUsefulContent(goal, neglectThisUnit);
        if (nextUnit) {
          Meteor.call("setGoal", goalId, nextUnit);
          resetQuestionFeedback();
          Session.set('isLoading', false);
          FlowRouter.go('/content/' + nextUnit);
          precompute(nextUnit);
        } else {
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
  var nodeId = FlowRouter.getParam('nodeId');
  localneeds = Meteor.globalFunctions.getNeeds(nodeId);
});

Template.unitPage.onRendered(function() {
  this.autorun(() => {
      if (this.subscriptionsReady()) {
        precompute(FlowRouter.getParam('nodeId'));
      }
    }),
    this.autorun(() => {
      if (this.subscriptionsReady()) {
        // WARNING: 1 - TIMEOUT SHOULDN'T BE DONE. 2 - TWO TIMEOUTS ARE EVEN WORSE, BUT ONE HANDLES QUICK LOADED PAGES AND OTHER REFRESHES
        setTimeout(function() {
          $('.ui.embed').embed();
          $.tab();
          $('.unit-tabs .item').tab();
          // set first tab as active
          $("[data-tab=1]").addClass('active');
          $('.ui.checkbox').checkbox();
        }, 50);
        setTimeout(function() {
          $('.ui.embed').embed();
          $.tab();
          $('.unit-tabs .item').tab();
          // set first tab as active
          $("[data-tab=1]").addClass('active');
          $('.ui.checkbox').checkbox();
        }, 300);
      }
    })
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

  'submit form': function(event) {
    event.preventDefault();

    console.log('entrou no string');

    var answerIsCorrect = null;
    if (this.answers.indexOf(event.target.exerciseString.value) > -1) {
      answerIsCorrect = true;
    } else answerIsCorrect = false;
    if (answerIsCorrect) {
      $("#exerciseStringField").addClass("disabled");
      $("#exerciseButton").removeClass("red").addClass("green").addClass("disabled");
      $("#exerciseInputText").removeClass("red text").addClass("green text");
      if (Meteor.userId()) {
        succeedUnit();
      }
    } else if (!answerIsCorrect) {
      $("#exerciseStringField").addClass("disabled");
      $("#exerciseButton").removeClass("green").addClass("red").addClass("disabled");
      $("#exerciseInputText").removeClass("green text").addClass("red text");
      if (Meteor.userId()) {
        failUnit();
      }
    }
  },
  'change .trueRadioButton': function(event) {
    $(".trueRadioButton").prop('disabled', 'disabled');
    $(".falseRadioButton").prop('disabled', 'disabled');
    $(".trueRadioButtonLabel").addClass("green text");
    $(".falseRadioButtonLabel").addClass("red text");
    if (Meteor.userId()) {
      succeedUnit();
    }
  },

  'change .falseRadioButton': function(event) {
    $(".trueRadioButton").prop('disabled', 'disabled');
    $(".falseRadioButton").prop('disabled', 'disabled');
    $(".trueRadioButtonLabel").addClass("green text");
    $(".falseRadioButtonLabel").addClass("red text");
    if (Meteor.userId()) {
      failUnit();
    }
  },
  'click #reload-unit': function(event, template) {
    event.preventDefault();
    Session.set('failedUnitAndNoGoal', false);
    precompute();
    setTimeout(function() {
      $('.ui.embed').embed();
      $.tab();
      $('.unit-tabs .item').tab();
      // set first tab as active
      $("[data-tab=1]").addClass('active');
      $('.ui.checkbox').checkbox();
    }, 200);
  }

  // 'click .set-goal': function(event, template) {
  //   event.preventDefault();
  //   Session.set('isLoading', true);
  //   var nodeId = FlowRouter.getParam('nodeId');
  //   var goal = {};
  //   goal[nodeId] = true;
  //   var unit = Meteor.globalFunctions.findUsefulContent(goal);
  //
  //   console.log(nodeId);
  //
  //   console.log(unit);
  //
  //   console.log(Meteor.userId());
  //   if (unit) {
  //     Meteor.call("setGoal", nodeId, unit, Meteor.userId());
  //   } else {
  //     toastr.info('Unfortunately there is no content to reach this goal yet');
  //     $(event.target).addClass('disabled');
  //   }
  // }

});
