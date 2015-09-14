Template.dashboard.helpers({
    'creatingUser': function() {
        return Session.get('callStatus') == 'creatingUser';
    },
});
