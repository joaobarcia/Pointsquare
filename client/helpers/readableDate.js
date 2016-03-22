Template.registerHelper('readableDate', function(dateInUnix) {
    return moment(dateInUnix).fromNow()
});
