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

Meteor.publish('goals', function() {
  return Goals.find();
});

Meteor.publish('userNames', function() {
  return Meteor.users.find({},{fields:{"username":1}});
});

/*Meteor.publish('singleContent', function(contentId) {
    return Nodes.find({
        type: 'content',
        _id: contentId
    });
});*/

Meteor.publishComposite("singleNode", function(args) {
  var nodeId = args.nodeId;
  var userId = args.userId;
  var x = 1;
  console.log("args");
  console.log(args);
  return {
    find: function() {
        return Nodes.findOne(nodeId);
      }
      /*,
              children: [{
                  find: function(node) {
                      return Personal.find({
                          node: node._id,
                          user: userId
                      });
                  }
              }]*/
  }
});

Meteor.publishComposite('singleContent', function(contentId, userId) {
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

// Meteor.publishComposite('onlyReady', function(userId) {
//   return {
//     find: function() {
//       // Find top ten highest scoring posts
//       var user_id = Meteor.users.findOne(userId)._id;
//       return Personal.find({
//         user: user_id,
//         state: {
//           $gt: 0.9
//         }
//       });
//     },
//     children: [{
//       find: function(personal) {
//         return Nodes.find({
//           _id: personal.node
//         });
//       }
//     }],
//   }
// });

Meteor.publish('singleConcept', function(conceptId) {
  return [
    Nodes.find({
      type: 'concept',
      _id: conceptId
    }),
    Requirements.find({
      node: conceptId
    })
  ];
});

Meteor.publish('allConcepts', function(conceptId) {
  return [Nodes.find({
    type: 'concept'
  }), Requirements.find()]
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
