Template.registerHelper('state', function() {
    if (Meteor.userId()) {
        var info = Personal.findOne({
            user: Meteor.userId(),
            node: Template.currentData()._id
        });
        return info? (info.state? info.state : 0) : 0;
        /*var id = Template.currentData()._id;//FlowRouter.getParam('contentId')?FlowRouter.getParam('contentId'):FlowRouter.getParam('conceptId');
        Meteor.call("getState",id,Meteor.userId(),function(e,r){
            Session.set("xftsgd",r);
        });
        return Session.get("xftsgd");*/
        /*var node = this.rid;
        var user_address = Meteor.users.findOne({
            '_id': Meteor.userId()
        }).emails[0].address;
        var items = people.findOne({
            'email': user_address
        }).mind;
        //console.log(items[node].state);
        return items[node].state;*/
        /*        for (var i = 0; i < items.length; i++) {
                    if (items[i].rid == node) {
                        return items[i].state;
                    }
                }*/
        //return 0;
    } else return 0;

});
