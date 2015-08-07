Template.conceptPage.helpers({
    'grantedUnit': function() {
        return Units.find({
            'out': this['@rid']
        })
    },
    'helpfulUnit': function(obj) {
        return Units.find({
            'in': this['@rid']
        })
    },
});

Template.conceptPage.helpers({
    'state': function() {
        var stateFromDB = Links.findOne({
            'in': this['@rid']
        })
        if (stateFromDB != undefined) return stateFromDB.state
        else return 0;
    }
});

// Workaround because spacebars does not accept special characters such as "@" from @rid
Template.conceptPage.helpers({
    'rid': function(obj) {
        return obj['@rid']
    }
});
