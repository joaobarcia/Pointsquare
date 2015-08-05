Meteor.methods({
    retrieveOrientDB: function() {
        Units.remove({});
        var orientDBUnits = HTTP.call("GET", "http://95.85.45.153:2480/query/3lingo2/sql/select *, out('grants'), in('isRequiredFor') from Unit limit 1000", {
            auth: "reader:reader"
        }).data.result;

        if (Units.find().count() < orientDBUnits.length) {
            for (var i = 0; i < orientDBUnits.length; i++) {
                Units.insert(orientDBUnits[i])
            };
        };


        Concepts.remove({});
        var orientDBConcepts = HTTP.call("GET", "http://95.85.45.153:2480/query/3lingo2/sql/select * from Concept limit 1000", {
            auth: "reader:reader"
        }).data.result;

        if (Concepts.find().count() < orientDBConcepts.length) {
            for (var i = 0; i < orientDBConcepts.length; i++) {
                Concepts.insert(orientDBConcepts[i])
            };
        };


        Links.remove({});
        var orientDBLinks = HTTP.call("GET", "http://95.85.45.153:2480/query/3lingo2/sql/select from informationLink where out.name = 'Yannis Varoufakis' limit 1000", {
            auth: "reader:reader"
        }).data.result;


        if (Links.find().count() < orientDBLinks.length) {
            for (var i = 0; i < orientDBLinks.length; i++) {
                Links.insert(orientDBLinks[i])
            };
        };
        /**/
    },
    resetOrientDB: function() {
        var query = "http://95.85.45.153:2480/function/3lingo2/resetAll/%2327%3A1";
        HTTP.call("POST", query, {
            auth: "admin:admin"
        });
        Meteor.call('retrieveOrientDB');
    },
    learn: function(result, unit, user) {
        var encodedUnit = encodeURIComponent(unit);
        var encodedUser = encodeURIComponent(user);
        var query = "http://95.85.45.153:2480/function/3lingo2/learn2/" + result + "/" + encodedUnit + "/" + encodedUser;
        HTTP.call("POST", query, {
            auth: "root:4f0g4.o.orientDB!"
        });

        console.log(query);

        // Re-import informationLink data
        var orientDBLinks = HTTP.call("GET", "http://95.85.45.153:2480/query/3lingo2/sql/select from informationLink where out.name = 'Yannis Varoufakis' limit 1000", {
            auth: "reader:reader"
        }).data.result;

        Links.remove({});
        if (Links.find().count() < orientDBLinks.length) {
            for (var i = 0; i < orientDBLinks.length; i++) {
                Links.insert(orientDBLinks[i])
            };
        };
    }
});
