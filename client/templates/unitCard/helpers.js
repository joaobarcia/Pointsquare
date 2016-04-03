/*Template.unitPage.helpers({

    authors: function() {
        var authors = Template.currentData().authors;
        console.log("logando");
        console.log(Template.currentData());
        var names = "";
        for(var id in authors){
            names += Meteor.users.findOne(id).username+", ";
        }
        return names.slice(0,-2);
    }

});*/