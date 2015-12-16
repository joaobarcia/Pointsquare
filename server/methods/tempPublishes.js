// Dummy content for tests
Meteor.startup(function() {

    Nodes.remove({});
    Edges.remove({});
    Sets.remove({});
    var david = Meteor.users.findOne({username:"David de Sousa Seixas"})._id;

    var unit= create_content({name: "test content"});
    var concept1 = create_concept({name: "test concept 1"});
    var concept2 = create_concept({name: "test concept 2"});
    add_set(unit,[concept1]);
    //edit_set(unit,[concept1,concept2]);

    /*
    var H = Meteor.call("createContent",{name: "H"});
    Meteor.call("addSet",H,[a1]);
    var a1 = Meteor.call("createConcept",{name: "a1"});
    //primeira árvore
    var b1 = Meteor.call("createConcept",{name: "b1"});
    var b2 = Meteor.call("createConcept",{name: "b2"});
    Meteor.call("addSet",a1,[b1,b2]);
    var M = Meteor.call("createContent",{name: "M"});
    Meteor.call("addSet",M,[b1,b2]);
    var c1 = Meteor.call("createConcept",{name: "c1"});
    var c2 = Meteor.call("createConcept",{name: "c2"});
    var c3 = Meteor.call("createConcept",{name: "c3"});
    Meteor.call("addSet",b1,[c1,c2]);
    Meteor.call("addSet",b2,[c2,c3]);
    var d1 = Meteor.call("createConcept",{name: "d1"});
    var d2 = Meteor.call("createConcept",{name: "d2"});
    var d3 = Meteor.call("createConcept",{name: "d3"});
    var d4 = Meteor.call("createConcept",{name: "d4"});
    Meteor.call("addSet",c1,[d1,d2]);
    Meteor.call("addSet",c2,[d2,d3]);
    Meteor.call("addSet",c3,[d3,d4]);
    var L = Meteor.call("createContent",{name: "L","to.grant":[d1,d2,d3,d4]});
    //segunda árvore
    var bb1 = Meteor.call("createConcept",{name: "bb1"});
    var bb2 = Meteor.call("createConcept",{name: "bb2"});
    Meteor.call("addSet",a1,[bb1,bb2]);
    var MM = Meteor.call("createContent",{name: "MM"});
    Meteor.call("addSet",MM,[bb1,bb2]);
    var cc1 = Meteor.call("createConcept",{name: "cc1"});
    var cc2 = Meteor.call("createConcept",{name: "cc2"});
    var cc3 = Meteor.call("createConcept",{name: "cc3"});
    Meteor.call("addSet",bb1,[cc1,cc2]);
    Meteor.call("addSet",bb2,[cc2,cc3]);
    var dd1 = Meteor.call("createConcept",{name: "dd1"});
    var dd2 = Meteor.call("createConcept",{name: "dd2"});
    var dd3 = Meteor.call("createConcept",{name: "dd3"});
    var dd4 = Meteor.call("createConcept",{name: "dd4"});
    Meteor.call("addSet",cc1,[dd1,dd2]);
    Meteor.call("addSet",cc2,[dd2,dd3]);
    Meteor.call("addSet",cc3,[dd3,dd4]);
    var LL = Meteor.call("createContent",{name: "LL","to.grant":[dd1,dd2,dd3,dd4]});

    Meteor.call("forwardUpdate",[Nodes.findOne({name:"d1"})._id,Nodes.findOne({name:"d2"})._id,Nodes.findOne({name:"d3"})._id,Nodes.findOne({name:"d4"})._id],Meteor.users.findOne()._id)
    */
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
