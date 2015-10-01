var orientURL = "http://95.85.45.153:2480";
var databaseName = "Pointsquare";
var root_password = "4f0g4.o.orientDB!";
/*var orientURL = "http://localhost:2480";
var databaseName = "alfa4";
var root_password = "4f0g4.o.orientE!";*/

Meteor.startup(function() {
    var orient_network = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20allLibrary()", {
        auth: "root:" + root_password
    }).data.result[0]['allLibrary'];
    knowledge.remove({});
    for (var i = 0; i < orient_network.length; i++) {
        knowledge.insert(orient_network[i]);
    };
    Meteor.publish('knowledge_network', function() {
        return knowledge.find();
    })
    var orient_users = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20allUsers()", {
        auth: "root:" + root_password
    }).data.result[0]['allUsers'];
    people.remove({});
    for (var i = 0; i < orient_users.length; i++) {
        people.insert(orient_users[i]);
    };
    Meteor.publish('user_names', function() {
        return people.find({}, {
            fields: {
                "name": 1,
                "rid": 1
            }
        });
    });
});


Meteor.publish('user_info', function() {
    if (this.userId) {
        Meteor.call("fetchAllUserData");
        var user_email = Meteor.users.findOne({
            '_id': this.userId
        }).emails[0].address;
        //console.log("personal info of" + user_email + "fetched")
        return people.find({
            'email': user_email
        });
    } else console.log("noone logged");
});

Meteor.methods({
    fetchAllUserData: function() {
        console.log("start pulling knowledge");
        var orient_network = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20allLibrary()", {
            auth: "root:" + root_password
        }).data.result[0]['allLibrary'];
        console.log("finished http knowledge");
        knowledge.remove({});
        for (var i = 0; i < orient_network.length; i++) {
            knowledge.insert(orient_network[i]);
        };
        console.log("finished inserting knowledge");
        /*        Meteor.publish('knowledge_network', function() {
                    return knowledge.find();
                })*/
        console.log("start pulling users");
        var orient_users = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20allUsers()", {
            auth: "root:" + root_password
        }).data.result[0]['allUsers'];

        console.log("finished http users");
        people.remove({});
        for (var i = 0; i < orient_users.length; i++) {
            people.insert(orient_users[i]);
        };
        console.log("finished inserting users");
        /*        Meteor.publish('user_names', function() {
                    return people.find({}, {
                        fields: {
                            "name": 1,
                            "rid": 1
                        }
                    });
                });*/

    },

    get_user_rid: function() {
        if (this.userId) {
            var user_address = Meteor.users.findOne({
                '_id': Meteor.userId()
            }).emails[0].address;
            var orient_user = people.findOne({
                'email': user_address
            });
            var user_rid = orient_user.rid;
            console.log(user_rid);
            return user_rid;
        } else console.log("tried to run get_user_rid but noone is logged")
    },

    precompute: function(unit) {
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var query = orientURL + "/function/" + databaseName + "/precompute/" + escape(unit) + "/" + escape(user_rid);
            res = HTTP.call("POST", query, {
                auth: "root:" + root_password
            });
            return res;
        } else console.log("Precompute error: no one is logged.")
    },

    succeed: function(unit) {
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var query = orientURL + "/function/" + databaseName + "/succeed/" + escape(unit) + "/" + escape(user_rid);
            res = HTTP.call("POST", query, {
                auth: "root:" + root_password
            });
            Meteor.call('fetchAllUserData');
            return res;
        } else console.log("Succeed error: no one is logged.")
    },

    fail: function(unit) {
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var query = orientURL + "/function/" + databaseName + "/fail/" + escape(unit) + "/" + escape(user_rid);
            res = HTTP.call("POST", query, {
                auth: "root:" + root_password
            });
            Meteor.call('fetchAllUserData');
            return res;
        } else console.log("Fail error: no one is logged.")
    },

    learn: function(result, unit) {
        console.log("sent learning request");
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var query = orientURL + "/function/" + databaseName + "/learn2/" + escape(result) + "/" + escape(unit) + "/" + escape(user_rid);
            var temp = 0;
            var res = null;
            res = HTTP.call("POST", query, {
                auth: "root:" + root_password
            });
            Meteor.call('fetchAllUserData');
            console.log("receved learning results");
            return res;
        } else console.log("tried to run learn method but no one is logged")
    },

    retrieve_user_info: function() {
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var new_info = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20nodeInfo(" + escape(user_rid) + ")", {
                auth: "root:" + root_password
            }).data.result[0]['nodeInfo'];
            people.update({
                'rid': user_rid
            }, new_info);
        } else console.log("tried to run retrieve_user_info method but noone is logged")
    },

    create_person: function(person_email, person_name) {
        var query = orientURL + "/function/" + databaseName + "/createPerson/" + escape(person_email) + "/" + escape(person_name) + "/" + '';
        var user_rid = HTTP.call("POST", query, {
            auth: "root:" + root_password
        }).data.result[0]['rid'];
        var res = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20nodeInfo(" + escape(user_rid) + ")", {
            auth: "root:" + root_password
        });
        var new_info = res.data.result[0]['nodeInfo'];
        people.insert(new_info);
        return res;
    },

    reset: function() {
        var user_rid = Meteor.call('get_user_rid');
        var query = orientURL + "/function/" + databaseName + "/resetAll/" + escape(user_rid);
        var res = HTTP.call("POST", query, {
            auth: "root:" + root_password
        });
        Meteor.call('fetchAllUserData');
        return res;
    },

    incrementViews: function(rid) {
        var query = orientURL + "/function/" + databaseName + "/incrementViews/" + escape(rid);
        HTTP.call("POST", query, {
            auth: "root:" + root_password
        });
        knowledge.update({
            'rid': rid
        }, {
            $inc: {
                'views': 1
            }
        })
    },

    createConcept: function() {
        var query = orientURL + "/function/" + databaseName + "/justCreateConcept";
        var res = HTTP.call("POST", query, {
            auth: "root:" + root_password
        }).data.result[0]['value'];
        var rid = res.data.result[0]['justCreateConcept'];
        knowledge.insert({
            'rid': rid,
            'class': 'Concept'
        });
        return res;
    },

    createUnit: function() {
        var query = orientURL + "/function/" + databaseName + "/justCreateUnit";
        var res = HTTP.call("POST", query, {
            auth: "root:" + root_password
        }).data.result[0]['value'];
        var rid = res.data.result[0]['justCreateUnit'];
        knowledge.insert({
            'rid': rid,
            'class': 'Unit'
        });
        return res;
    },

    addAuthor: function(author, unit) {
        var query = orientURL + "/function/" + databaseName + "/addAuthor/" + escape(author) + "/" + escape(unit);
        var res = HTTP.call("POST", query, {
            auth: "root:" + root_password
        }).data.result[0]['value'];
        return res;
    }

})
