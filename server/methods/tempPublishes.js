// Dummy content for tests
Meteor.startup(function() {

    Nodes.remove({});
    Edges.remove({});
    Requirements.remove({});
    Personal.remove({});
    //Knowledge.remove({});
    //Comments.remove({});
    //Scores.remove({});

    var david = Meteor.users.findOne()._id;

    var unit = create_content({name: "unit"});
    var concept = create_concept({name: "concept"});
    var a = create_concept({name: "a"});
    var b1 = create_concept({name: "b1"});
    var b2 = create_concept({name: "b2"});
    var c1 = create_concept({name: "c1"});
    var c2 = create_concept({name: "c2"});
    var c3 = create_concept({name: "c3"});
    var c4 = create_concept({name: "c4"});
    var set = {};
    set[concept] = true;
    add_set(unit,set);
    set = {};
    set[a] = true;
    add_set(unit,set);
    set = {};
    set[b1] = true;
    set[b2] = true;
    add_set(a,set);
    set = {};
    set[c1] = true;
    set[c2] = true;
    add_set(b1,set);
    set = {};
    set[c3] = true;
    set[c4] = true;
    add_set(b2,set);

});

Meteor.publish('nodes', function() {
    return Nodes.find();
});
Meteor.publish('sets', function() {
    return Requirements.find();
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
