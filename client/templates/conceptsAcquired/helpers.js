Template.conceptsAcquired.helpers({
    concept: function() {
        var query = {
            state: { $gte: 0.9 },
            user: Meteor.userId()
        };
        var res = Personal.find(query).fetch();
        var ids = [];
        for(var i in res){
            var node = Nodes.findOne(res[i].node);
            if(node){
              if(node.type == "concept"){ ids.push(node._id); }
            }
        };
        return Nodes.find({"_id":{$in:ids}});
    }
});
