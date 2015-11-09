// Dummy content for tests
Meteor.startup(function() {
    knowledge.remove({});
    knowledge.insert({
        _id: 'DPtRtpZtqSqofWHve',
        authors: [],
        class: 'Unit',
        name: 'Learning Numbers with DJ Khan',
        views: 0,
        likes: 0,
        dislikes: 0,
        totalAttempts: 0,
        createdAt: 1446834836024,
        description: 'So magics, much nice numbers are good',
        content: [{
            "type": "unitSection",
            "subContent": [{
                "type": "youtube",
                "youtubeVidID": "oRKxmXwLvUU"
            }]
        }, {
            "evaluationType": "userConfirmation",
            "type": "unitEvaluationSection"
        }]
    });
    knowledge.insert({
        _id: 'eNrKkjT9rfJPDAYjj',
        class: 'Concept',
        name: 'Numbers',
        description: '1 2 and 3'
    });
    Meteor.publish('knowledge_network', function() {
        return knowledge.find();
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
