Meteor.publish("units", function() {
    return Units.find();

});

Meteor.publish("concepts", function() {
    return Concepts.find();

});

Meteor.publish("links", function() {
    return Links.find();
});
