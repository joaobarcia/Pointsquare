// Dummy content for tests
Meteor.startup(function() {

    Nodes.remove({});
    Edges.remove({});
    //Knowledge.remove({});
    //Comments.remove({});
    //Scores.remove({});

    var david = Meteor.users.findOne({username:"David de Sousa Seixas"})._id;

    var unit = create_content({name: "test content"});
    var concept1 = create_concept({name: "test concept 1"});
    var concept2 = create_concept({name: "test concept 2"});
    add_set(unit,[concept1]);
    //edit_set(unit,[concept1,concept2]);

});

Meteor.publish('nodes', function() {
    return Nodes.find();
});
Meteor.publish('sets', function() {
    return Sets.find();
});
Meteor.publish("edges", function() {
    return Edges.find();
});
// Just for tests
Meteor.publish('personal', function() {
    return Personal.find();
});

/*Meteor.publish('singleContent', function(contentId) {
    return Nodes.find({
        type: 'content',
        _id: contentId
    });
});*/

Meteor.publishComposite('singleContent', function(contentId) {
    return {
        find: function() {
            // Find top ten highest scoring posts
            return Nodes.find({
                type: 'content',
                _id: contentId
            });
        },
        children: [{
            find: function(content) {
                return Personal.find({
                    type: 'state',
                    from: 'user1',
                    to: content._id
                });
            }
        }],
    }
});

Meteor.publish('singleConcept', function(conceptId) {
    return Nodes.find({
        type: 'concept',
        _id: conceptId
    });
});

Meteor.publish('allConcepts', function(conceptId) {
    return Nodes.find({
        type: 'concept'
    });
});

Meteor.publish('people', function() {
    var userCursor = Meteor.users.find({}, {
        fields: {
            username: 1,
            profile: 1
        }
    });

    // this automatically observes the cursor for changes,
    // publishes added/changed/removed messages to the 'people' collection,
    // and stops the observer when the subscription stops
    Mongo.Collection._publishCursor(userCursor, this, 'people');

    this.ready();
});
