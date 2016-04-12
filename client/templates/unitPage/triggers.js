function succeedUnit() {
    Session.set('isLoading', true);
    soundSuccess.play();
    var $toastSuccess = $('<span class="green-text">Good job!</span>');
    Materialize.toast($toastSuccess, 2000);
    Meteor.call("succeed", FlowRouter.getParam('contentId'), Meteor.userId(), function(e, r) {
        var goal = Goals.findOne({user:Meteor.userId()});
        if(goal){
            Meteor.call("setGoal", goal.node, Meteor.userId(), function(e, r) {
                FlowRouter.go('goalPage');
                Session.set('isLoading', false);
            });
        }
        else{
            FlowRouter.go('dashboard');
            Session.set('isLoading', false);
        }
    });
}

function failUnit() {
    Session.set('isLoading', true);
    soundFail.play();
    var $toastFailWithGoal = $('<span class="red-text">Try another unit next</span>');
    var $toastFailWithoutGoal = $('<span class="red-text">Try setting this unit as goal!</span>');
    // if goal exists
    if (typeof Goals.findOne({
            user: Meteor.userId()
        }) !== "undefined") {
        Materialize.toast($toastFailWithGoal, 2000);
    } else {
        Materialize.toast($toastFailWithoutGoal, 2000);
    }
    Meteor.call("fail", FlowRouter.getParam('contentId'), Meteor.userId(), function(e, r) {
        var goal = Goals.findOne({user:Meteor.userId()});
        // if goal exists
        if(goal){
            Meteor.call("setGoal", goal.node, Meteor.userId(), function(e, r) {
                FlowRouter.go('goalPage');
            });
        }
        else{
            // otherwise prompt user about setting unit as goal
            Session.set('failedUnitAndNoGoal', true);
        }
        Session.set('isLoading', false);
    });
}

Template.unitPage.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var contentId = FlowRouter.getParam('contentId');
        self.subscribe('singleContent', contentId);
        self.subscribe('allConcepts');
    });
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

    'submit #exerciseStringForm': function(event) {
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
        var nodeId = FlowRouter.getParam('contentId');
        console.log(nodeId);
        Meteor.call("setGoal", nodeId, Meteor.userId(), function(e, r) {
            FlowRouter.go('goalPage');
            Session.set('isLoading', false);
        });
    }


});
