var orient_network = HTTP.call("GET", "http://95.85.45.153:2480/query/Pointsquare/sql/select%20allLibrary()", {
    auth: "root:4f0g4.o.orientDB!"
}).data.result[0]['allLibrary'];
knowledge.remove({});
for (var i = 0; i < orient_network.length; i++) {
    knowledge.insert(orient_network[i]);
};
Meteor.publish('knowledge_network', function() {
    return knowledge.find();
})

var orient_users = HTTP.call("GET", "http://95.85.45.153:2480/query/Pointsquare/sql/select%20allUsers()", {
    auth: "root:4f0g4.o.orientDB!"
}).data.result[0]['allUsers'];
people.remove({});
for (var i = 0; i < orient_users.length; i++) {
    people.insert(orient_users[i]);
};

Meteor.publish('user_info', function() {

    var user_email = Meteor.users.findOne({
        '_id': this.userId
    }).emails[0].address;
    return people.find({
        'email': user_email
    });
});

Meteor.methods({

    /*    create_person: function(person_email, person_name) {
            var query = "http://95.85.45.153:2480/function/Pointsquare/createPerson/" + escape(person_email) + "/" + escape(person_name) + "/" + '';
            var user_rid = HTTP.call("POST", query, {
                auth: "root:4f0g4.o.orientDB!"
            }).data.result[0]['value'];
            var new_info = HTTP.call("GET", "http://95.85.45.153:2480/query/Pointsquare/sql/select%20nodeInfo(" + escape(user_rid) + ")", {
                auth: "root:4f0g4.o.orientDB!"
            }).data.result[0]['nodeInfo'];
            people.insert(new_info);
        },

        get_user_rid: function() {
            var user_address = Meteor.users.findOne({
                '_id': Meteor.userId()
            }).emails[0].address;
            var orient_user = people.findOne({
                'email': user_address
            });
            var user_rid = orient_user.rid;
            return user_rid;
        },

        retrieve_user_info: function() {
            var user_rid = Meteor.call('get_user_rid');
            var new_info = HTTP.call("GET", "http://95.85.45.153:2480/query/Pointsquare/sql/select%20nodeInfo(" + escape(user_rid) + ")", {
                auth: "root:4f0g4.o.orientDB!"
            }).data.result[0]['nodeInfo'];
            people.update({
                'rid': user_rid
            }, new_info);
        },*/

    learn: function(unit) {
        var user_rid = Meteor.call('get_user_rid');
        var query = "http://95.85.45.153:2480/function/Pointsquare/learn2/1/" + escape(unit) + "/" + escape(user_rid);
        HTTP.call("POST", query, {
            auth: "root:4f0g4.o.orientDB!"
        });
        Meteor.call('retrieve_user_info');
    },

    /*    reset: function() {
            var user_rid = Meteor.call('get_user_rid');
            var query = "http://95.85.45.153:2480/function/Pointsquare/resetAll/" + escape(user_rid);
            HTTP.call("POST", query, {
                auth: "root:4f0g4.o.orientDB!"
            });
            Meteor.call('retrieve_user_info');
        }
    */

})
