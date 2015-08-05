//USER IS HARDCODED AS #17:1
Template.conceptCard.helpers({
    'state': function() {
        var stateFromDB = Links.findOne({
            'in': this['@rid']
        })
        if (stateFromDB != undefined) return stateFromDB.state
        else return 0;
    }
});
