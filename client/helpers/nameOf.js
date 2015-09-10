// ONLY SHOWS 

Template.registerHelper('nameOf', function(authorsRid, options) {
    console.log("oupu")
    return people.findOne({
        'rid': authorsRid[0].rid
    }).name;
});
