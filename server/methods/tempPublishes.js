// Dummy content for tests
Meteor.startup(function() {

    Nodes.remove({});
    Edges.remove({});
    //Knowledge.remove({});
    //Comments.remove({});
    //Scores.remove({});

    var a1 = Nodes.insert({
        type: "concept",
        name: "a1",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: [],
    });
    var lesson = Nodes.insert({
        type: "content",
        name: "lesson",
        description: "So magics, much nice numbers are good",
        authors: [],
        views: 0,
        likes: 0,
        dislikes: 0,
        totalAttempts: 0,
        createdAt: Date.now(),
        content: [{
            "type": "unitSection",
            "subContent": [{
                "type": "youtube",
                "youtubeVidID": "oRKxmXwLvUU"
            }]
        }, {
            "type": "unitSection",
            "subContent": [{
                "type": "text",
                "text": "YOLOYOLO"
            }]
        }, {
            "evaluationType": "userConfirmation",
            "type": "unitEvaluationSection"
        }],
        requirements: [],
        grants: []
    });
    Nodes.update({
        _id: a1
    }, {
        $push: {
            grantedBy: lesson
        }
    });
    Nodes.update({
        _id: lesson
    }, {
        $push: {
            grants: a1
        }
    });
    var r1 = Nodes.insert({
        type: "set",
        name: "r1",
        createdAt: Date.now(),
        concepts: [],
        neededFor: []
    });
    var r2 = Nodes.insert({
        type: "set",
        name: "r2",
        createdAt: Date.now(),
        concepts: [],
        neededFor: []
    });
    Nodes.update({
        _id: lesson
    }, {
        $push: {
            requirements: {
                $each: [r1, r2]
            }
        }
    });
    Nodes.update({
        _id: r1
    }, {
        $push: {
            neededFor: lesson
        }
    });
    Nodes.update({
        _id: r2
    }, {
        $push: {
            neededFor: lesson
        }
    });
    var b11 = Nodes.insert({
        type: "concept",
        name: "b11",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    });
    var b12 = Nodes.insert({
        type: "concept",
        name: "b12",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    });
    Nodes.update({
        _id: r1
    }, {
        $push: {
            concepts: {
                $each: [b11, b12]
            }
        }
    });
    Nodes.update({
        _id: b11
    }, {
        $push: {
            belongsTo: r1
        }
    });
    Nodes.update({
        _id: b12
    }, {
        $push: {
            belongsTo: r1
        }
    });
    var b21 = Nodes.insert({
        type: "concept",
        name: "b21",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    });
    var b22 = Nodes.insert({
        type: "concept",
        name: "b22",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    });
    Nodes.update({
        _id: r2
    }, {
        $push: {
            concepts: {
                $each: [b21, b22]
            }
        }
    });
    Nodes.update({
        _id: b21
    }, {
        $push: {
            belongsTo: r2
        }
    });
    Nodes.update({
        _id: b22
    }, {
        $push: {
            belongsTo: r2
        }
    });
    // Just for tests
    Knowledge.insert({
        type: 'state',
        from: 'user1',
        to: a1,
        value: 3
    })
    Knowledge.insert({
        type: 'state',
        from: 'user1',
        to: b11,
        value: 4
    })
    Knowledge.insert({
        type: 'state',
        from: 'user1',
        to: b12,
        value: 2
    })
    Knowledge.insert({
        type: 'state',
        from: 'user1',
        to: lesson,
        value: 1
    })

    Sets.remove({});
<<<<<<< HEAD
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
=======
    var david = Meteor.users.findOne({
        username: "David de Sousa Seixas"
    })._id;
    var H = Meteor.call("createContent", {
        name: "H"
    });
    Meteor.call("addSet", H, [a1]);
    var a1 = Meteor.call("createConcept", {
        name: "a1"
    });
>>>>>>> 9ff96fd0b1253bd910fff37954ec0ceb09022398
    //primeira árvore
    var b1 = Meteor.call("createConcept", {
        name: "b1"
    });
    var b2 = Meteor.call("createConcept", {
        name: "b2"
    });
    Meteor.call("addSet", a1, [b1, b2]);
    var M = Meteor.call("createContent", {
        name: "M"
    });
    Meteor.call("addSet", M, [b1, b2]);
    var c1 = Meteor.call("createConcept", {
        name: "c1"
    });
    var c2 = Meteor.call("createConcept", {
        name: "c2"
    });
    var c3 = Meteor.call("createConcept", {
        name: "c3"
    });
    Meteor.call("addSet", b1, [c1, c2]);
    Meteor.call("addSet", b2, [c2, c3]);
    var d1 = Meteor.call("createConcept", {
        name: "d1"
    });
    var d2 = Meteor.call("createConcept", {
        name: "d2"
    });
    var d3 = Meteor.call("createConcept", {
        name: "d3"
    });
    var d4 = Meteor.call("createConcept", {
        name: "d4"
    });
    Meteor.call("addSet", c1, [d1, d2]);
    Meteor.call("addSet", c2, [d2, d3]);
    Meteor.call("addSet", c3, [d3, d4]);
    var L = Meteor.call("createContent", {
        name: "L",
        "to.grant": [d1, d2, d3, d4]
    });
    //segunda árvore
    var bb1 = Meteor.call("createConcept", {
        name: "bb1"
    });
    var bb2 = Meteor.call("createConcept", {
        name: "bb2"
    });
    Meteor.call("addSet", a1, [bb1, bb2]);
    var MM = Meteor.call("createContent", {
        name: "MM"
    });
    Meteor.call("addSet", MM, [bb1, bb2]);
    var cc1 = Meteor.call("createConcept", {
        name: "cc1"
    });
    var cc2 = Meteor.call("createConcept", {
        name: "cc2"
    });
    var cc3 = Meteor.call("createConcept", {
        name: "cc3"
    });
    Meteor.call("addSet", bb1, [cc1, cc2]);
    Meteor.call("addSet", bb2, [cc2, cc3]);
    var dd1 = Meteor.call("createConcept", {
        name: "dd1"
    });
    var dd2 = Meteor.call("createConcept", {
        name: "dd2"
    });
    var dd3 = Meteor.call("createConcept", {
        name: "dd3"
    });
    var dd4 = Meteor.call("createConcept", {
        name: "dd4"
    });
    Meteor.call("addSet", cc1, [dd1, dd2]);
    Meteor.call("addSet", cc2, [dd2, dd3]);
    Meteor.call("addSet", cc3, [dd3, dd4]);
    var LL = Meteor.call("createContent", {
        name: "LL",
        "to.grant": [dd1, dd2, dd3, dd4]
    });

    Meteor.call("forwardUpdate", [Nodes.findOne({
        name: "d1"
    })._id, Nodes.findOne({
        name: "d2"
    })._id, Nodes.findOne({
        name: "d3"
    })._id, Nodes.findOne({
        name: "d4"
    })._id], Meteor.users.findOne()._id)

<<<<<<< HEAD
    Meteor.call("forwardUpdate",[Nodes.findOne({name:"d1"})._id,Nodes.findOne({name:"d2"})._id,Nodes.findOne({name:"d3"})._id,Nodes.findOne({name:"d4"})._id],Meteor.users.findOne()._id)
    */
=======

>>>>>>> 9ff96fd0b1253bd910fff37954ec0ceb09022398
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
