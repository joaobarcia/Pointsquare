// Dummy content for tests
Meteor.startup(function() {
    Nodes.remove({});
    Edges.remove({});
    //Knowledge.remove({});
    //Comments.remove({});
    //Scores.remove({});
    var test = Meteor.call("createConcept");
    /*var a1 = Nodes.insert({
        type: "concept",
        name: "a1",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    })._id;
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
    })._id;
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
    })._id;
    var r2 = Nodes.insert({
        type: "set",
        name: "r2",
        createdAt: Date.now(),
        concepts: [],
        neededFor: []
    })._id;
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
    })._id;
    var b12 = Nodes.insert({
        type: "concept",
        name: "b12",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    })._id;
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
    })._id;
    var b22 = Nodes.insert({
        type: "concept",
        name: "b22",
        description: "",
        createdAt: Date.now(),
        requirements: [],
        belongsTo: [],
        grantedBy: []
    })._id;
    Nodes.update({
        _id: r2
    }, {
        $push: {
            concepts: {
                $each: [b21, b22]
            }
        }
    });
    Nodes.update({ _id: b21 }, 
    {
        $push: { belongsTo: r2 }
    });
    Nodes.update({
        _id: b22
    }, {
        $push: {
            belongsTo: r2
        }
    });
*/
});

Meteor.publish('nodes', function() {
    return Nodes.find();
});

Meteor.publish('singleContent', function(contentId) {
    return Nodes.find({
        type: 'content',
        _id: contentId
    });
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
