// Tests for mongo search
Tests = new Mongo.Collection('tests');

Tests.allow({
    insert: function(userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        // can only change your own documents
        return true;
    },
    remove: function(userId, doc) {
        // can only remove your own documents
        return true;
    }
});

if (Meteor.isServer) {
    Meteor.publish('tests', function() {
        return Tests.find();
    });
}
