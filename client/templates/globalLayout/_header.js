Template._header.rendered = function() {
    Meteor.setTimeout(function() {

        this.$('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            alignment: 'right',
            gutter: 0,
            belowOrigin: true
        });

        this.$('.button-collapse').sideNav({
            menuWidth: 240,
            activationWidth: 70,
            closeOnClick: true
        });

    }.bind(this), 200);

    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
};

Template._header.helpers({
    'callStatus': function() {
        return Session.get('callStatus')
    },
});
