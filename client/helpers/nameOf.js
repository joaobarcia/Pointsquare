// ONLY SHOWS 

Template.registerHelper('nameOf', function(authorsRid, options) {
    return people.findOne({
        'rid': authorsRid[0].rid
    }).name;
});
