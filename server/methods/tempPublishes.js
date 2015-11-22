// Dummy content for tests
Meteor.startup(function() {
    Nodes.remove({});
    Edges.remove({});
    Sets.remove({});
    Personal.remove({});
    //Comments.remove({});
    //Scores.remove({});
    var testConcept = Meteor.call("createConcept", {
        name: "Bonobo",
        description: "Horny monkey"
    });
    var testContent = Meteor.call("createContent", {
        name: "Bonobo",
        description: "Horny monkey"
    });
    var list = [];
    list.push(testConcept);
    var oldSet = Meteor.call("addSet",testContent,list);
    var david = Meteor.users.findOne({username:"David de Sousa Seixas"})._id;
    //console.log(Meteor.call("getState",testContent,david));
    console.log(getState(testContent,david));
    /*
    Meteor.call("editNode",testConcept,{name: "Banaba"});*/
    /*
    var testConcept1  = Meteor.call("createConcept", {});
    var testConcept2  = Meteor.call("createConcept", {});
    var testConcept3  = Meteor.call("createConcept", {});
    console.log("creating new set "+newSet);
    var newSet = Meteor.call("addSet",testContent,[testConcept1,testConcept2,testConcept3]);
    //Meteor.call("editSet",newSet,[testConcept1,testConcept2]);
    //Meteor.call("removeSet",newSet);
    console.log("removing node "+testConcept3);
    console.log("is included in "+Nodes.findOne(testConcept3).to.include);
    Meteor.call("removeNode",testConcept3);
    var all = Nodes.find().fetch();
    for( var i = 0 ; i < all.length ; i++ ){
        console.log("node "+all[i]._id);
        console.log("is included in "+all[i].to.include);
    }
    console.log("the new set is now composed of "+Object.keys(Sets.findOne(newSet).set));
    */
    /*
    console.log(Sets.find().fetch().length);
    Meteor.call("removeNode",testContent);
    console.log(Sets.find().fetch().length);
    */
/*
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
