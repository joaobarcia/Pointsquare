//USER IS HARDCODED AS #27:3
Template.unitCard.helpers({
    'state': function() {
        var stateFromDB = Links.findOne({
            'in': this['@rid']
        })
        if (stateFromDB != undefined) return stateFromDB.state
        else return 0;
    }
});
