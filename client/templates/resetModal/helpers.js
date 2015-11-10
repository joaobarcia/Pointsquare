Template.resetModal.helpers({
    'resetting': function() {
        return Session.get('callStatus') == 'resetting';
    },
});
