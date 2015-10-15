var orientURL = "http://95.85.45.153:2480";
var databaseName = "Pointsquare";
var root_password = "4f0g4.o.orientDB!";
// var orientURL = "http://localhost:2480";
// var databaseName = "alfa5";
// var root_password = "4f0g4.o.orientE!";

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
        return 1;

    },

    get_user_rid: function() {
        if (Meteor.userId()) {
            var user_address = Meteor.user().emails[0].address;
            var orient_user = people.findOne({
                'email': user_address
            });
            var user_rid = orient_user.rid;
            return user_rid;
        } else console.log("tried to run get_user_rid but noone is logged")
    },

    precompute: function(unit) {
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var query = orientURL + "/function/" + databaseName + "/precompute/" + encodeURIComponent(unit) + "/" + encodeURIComponent(user_rid);
            res = HTTP.call("POST", query, {
                auth: "root:" + root_password
            });
            return res;
        } else console.log("Precompute error: no one is logged.");
    },

    succeed: function(unit) {
        if (this.userId) {
            var user_rid = Meteor.call('get_user_rid');
            var query = orientURL + "/function/" + databaseName + "/succeed/" + encodeURIComponent(unit) + "/" + encodeURIComponent(user_rid);
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
            var query = orientURL + "/function/" + databaseName + "/fail/" + encodeURIComponent(unit) + "/" + encodeURIComponent(user_rid);
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
            var query = orientURL + "/function/" + databaseName + "/learn2/" + encodeURIComponent(result) + "/" + encodeURIComponent(unit) + "/" + encodeURIComponent(user_rid);
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
            var new_info = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20nodeInfo(" + encodeURIComponent(user_rid) + ")", {
                auth: "root:" + root_password
            }).data.result[0]['nodeInfo'];
            people.update({
                'rid': user_rid
            }, new_info);
        } else console.log("tried to run retrieve_user_info method but noone is logged")
    },

    create_person: function(person_email, person_name) {
        var query = orientURL + "/function/" + databaseName + "/createPerson/" + encodeURIComponent(person_email) + "/" + encodeURIComponent(person_name) + "/" + '';
        var user_rid = HTTP.call("POST", query, {
            auth: "root:" + root_password
        }).data.result[0]['rid'];
        var res = HTTP.call("GET", orientURL + "/query/" + databaseName + "/sql/select%20nodeInfo(" + encodeURIComponent(user_rid) + ")", {
            auth: "root:" + root_password
        });
        var new_info = res.data.result[0]['nodeInfo'];
        people.insert(new_info);
        return res;
    },

    reset: function() {
        var user_rid = Meteor.call('get_user_rid');
        var query = orientURL + "/function/" + databaseName + "/resetAll/" + encodeURIComponent(user_rid);
        var res = HTTP.call("POST", query, {
            auth: "root:" + root_password
        });
        Meteor.call('fetchAllUserData');
        return res;
    },

    incrementViews: function(rid) {
        var query = orientURL + "/function/" + databaseName + "/incrementViews/" + encodeURIComponent(rid);
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

    createConcept: function(properties, subsets) {
        if( this.userId ){
            var setsString = JSON.stringify(subsets);
            var query = orientURL + "/function/" + databaseName + "/createConceptNew";
            var data = {};
            data["json"] = properties;
            data["needed"] = setsString;
            console.log(data);
            var res = HTTP.call("POST", query, {
                auth: "root:" + root_password,
                data: data
            }).data.result[0]['value'];
            var rid = res;
            Meteor.call('fetchAllUserData');
            return res;
        }
    },

    createUnit: function(properties, subsets, grantset) {
        if( this.userId ){
            var setsString = JSON.stringify(subsets);
            var grantString = grantset;
            var query = orientURL + "/function/" + databaseName + "/createUnitNew";
            var data = {};
            data["json"] = properties;
            data["needed"] = setsString;
            data["granted"] = [];
            var res = HTTP.call("POST", query,
                {
                    auth: "root:" + root_password,
                    data: data
                }).data.result[0]['value'];
            console.log("result: "+res);
            var rid = res;
            console.log('we did it!');
            var user_rid = Meteor.call('get_user_rid');
            console.log('we did it!');
            Meteor.call('addAuthor', user_rid, rid);
            Meteor.call('fetchAllUserData');
            return res;
        }
    },

    addAuthor: function(author, unit) {
        var query = orientURL + "/function/" + databaseName + "/addAuthor/" + encodeURIComponent(author) + "/" + encodeURIComponent(unit);
        var res = HTTP.call("POST", query, {
            auth: "root:" + root_password
        });
        return res;
    },

    editUnit: function(rid, properties, subsets, grantset) {
        if( this.userId ){
            var unit = rid.substr(1);
            var setsString = JSON.stringify(subsets);
            var grantString = grantset;
            var query = orientURL + "/function/" + databaseName + "/editUnitNew";
            var data = {};
            data["rid"] = rid;
            data["json"] = properties;
            data["needed"] = setsString;
            data["granted"] = [];
            var res = HTTP.call("POST", query,
                {
                    auth: "root:" + root_password,
                    data: data
                }).data.result[0]['value'];
            console.log(res);
            console.log('we did it!');
            Meteor.call('fetchAllUserData');
            return rid;
        }
    },

    editConcept: function(rid, properties, subsets) {
        console.log("editconcept");
        if( this.userId ){
            var concept = rid;
            var setsString = JSON.stringify(subsets);
            var query = orientURL + "/function/" + databaseName + "/editConceptNew";
            var data = {};
            data["rid"] = rid.substr(1);
            data["json"] = properties;
            data["needed"] = setsString;
            var res = HTTP.call("POST", query,
                {
                    auth: "root:" + root_password,
                    data: data
                }).data.result[0]['value'];
            console.log(res);
            Meteor.call('fetchAllUserData');
            return rid;
        }
    },

    removeNode: function(rid) {
        if( this.userId ){
            var query = orientURL + "/function/" + databaseName + "/deleteNode/"+encodeURIComponent(rid);
            var res = HTTP.call("POST",query,{auth: "root:" + root_password});
            Meteor.call('fetchAllUserData');
            return res;
        }
    }

})
