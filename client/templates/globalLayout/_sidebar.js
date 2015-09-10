Template._sidebar.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });

    $(document).ready(function() {
        $('.modal-trigger').leanModal();
    });
}


Template._sidebar.events({
    'click #resetUserKnowledge': function() {
        Meteor.call("reset");
    },
});
