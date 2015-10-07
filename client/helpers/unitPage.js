Template.unitPage.helpers({
    grantedConcepts: function() {
        return knowledge.find({
            'class': 'Concept',
            'granted_by.rid': this.rid
        });
    },

    requiredConcepts: function() {
        return knowledge.find({
            'class': 'Concept',
            'required_for.rid': this.rid
        });
    },

    'doingExercise': function() {
        return Session.get('callStatus') == 'doingExercise';
    },

    'learning': function() {
        return Session.get('callStatus') == 'learning' || Session.get('callStatus') == 'unlearning';
    },

    'learned': function() {
        return Session.get('callStatus') == 'learned';
    },

    'unlearned': function() {
        return Session.get('callStatus') == 'unlearned';
    },

    'learnedConcept': function() {
        var newConcepts = Session.get('newConcepts');
        console.log(knowledge.find({
            'rid': {
                $in: newConcepts
            }
        }).fetch());
        return knowledge.find({
            'rid': {
                $in: newConcepts
            }
        }, {
            limit: 3
        });
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },

    'activatedUnit': function() {
        var newConcepts = Session.get('newUnits');
        return knowledge.find({
            'rid': {
                $in: newUnits
            }
        }, {
            limit: 3
        });
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },

    'unlearnedConcept': function() {
        var lostConcepts = Session.get('lostConcepts');
        return knowledge.find({
            'rid': {
                $in: lostConcepts
            }
        }, {
            limit: 3
        });
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },

    'deactivatedUnit': function() {
        var newConcepts = Session.get('newConcepts');
        return knowledge.find({
            'rid': {
                $in: newConcepts
            }
        }, {
            limit: 3
        });
        //return knowledge.find({ 'rid':{$in:['#14:20','#14:21','#14:22']} });
    },



});
Template.unitContent.helpers({
    'unitIsOneSectionAndNoExercise': function() {
        var unitContent = this.content;
        var numberOfSections = _.filter(unitContent, {
            'type': 'unitSection'
        }).length;
        var noExercise = _.includes(_.find(unitContent, {
            'type': 'unitEvaluationSection'
        }), 'userConfirmation');
        if (numberOfSections == 1 && noExercise) {
            return 1
        } else return 0;
    }
})
