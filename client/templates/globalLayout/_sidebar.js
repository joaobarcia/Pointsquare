Template._sidebar.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });

        $('.modal-trigger').leanModal();
    });
}

Template._sidebar.events({
    'click #resetUserKnowledge': function() {
    	Session.set('callStatus','resetting');
        Meteor.call("reset", function(error,result){
            if (result.statusCode >= 200 && result.statusCode < 300) {
                Session.set('callStatus', 'OK');
            }
        });
    },
});
