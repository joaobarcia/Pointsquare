Router.route('/', {
    name: 'home',
    //waitOn: function() {}
});

Router.route('/search', {
    name: 'search',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    // Reset easy search when leaving search results
    onStop: function() {
        var instance = EasySearch.getComponentInstance({
            index: 'knowledge'
        });
        EasySearch.changeProperty('knowledge', 'filteredClasses', ['Unit']);
        EasySearch.changeProperty('knowledge', 'onlyNewUnits', true);
        EasySearch.changeProperty('knowledge', 'onlyHighProspect', true);
        EasySearch.changeProperty('knowledge', 'orderBy', 'state');
        instance.clear();


    }
})

Router.route('/unit/:_name', {
    name: 'unitPage',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    data: function() {
        return knowledge.findOne({
            name: this.params._name
        });
    }
});
Router.route('/concept/:_name', {
    name: 'conceptPage',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    data: function() {
        return knowledge.findOne({
            name: this.params._name
        });
    }
});

Router.route('/dashboard', {
    name: 'dashboard',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
});

Router.plugin('ensureSignedIn', {
    only: ['dashboard']
});
