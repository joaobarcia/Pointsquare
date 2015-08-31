Template.registerHelper('state', function() {
    if (Meteor.userId()) {
        var node = this.rid;
        var user_address = Meteor.users.findOne({
            '_id': Meteor.userId()
        }).emails[0].address;
        var items = people.findOne({
            'email': user_address
        }).mind;
        for (var i = 0; i < items.length; i++) {
            if (items[i].rid == node) {
                return items[i].state;
            }
        }
        return 0;
    } else return 0;

});
