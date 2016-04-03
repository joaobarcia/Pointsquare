FlowRouter.route('/', {
    name: 'home',
    // subscriptions: function(params) {
    //     this.register("nodes", Meteor.subscribe("nodes"));
    //     //this.register("edges", Meteor.subscribe("edges"));
    //     //this.register("sets", Meteor.subscribe("sets"));
    //     //this.register("personal", Meteor.subscribe("personal"));
    // },
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "home"
        });
    }
});

FlowRouter.route('/search', {
    name: 'search',
    // subscriptions: function(params) {
    //     //this.register("onlyReady",Meteor.subscribe("onlyReady",Meteor.userId()));
    //     //this.register("nodes", Meteor.subscribe("nodes"));
    //     //this.register("edges", Meteor.subscribe("edges"));
    //     //this.register("sets", Meteor.subscribe("sets"));
    //     //this.register("personal", Meteor.subscribe("personal"));
    // },
    // triggersEnter: function() {
    //     /*var instance = EasySearch.getComponentInstance({
    //         index: 'nodes'
    //     });
    //     EasySearch.changeProperty('nodes', 'filteredClasses', ['content']);
    //     EasySearch.changeProperty('nodes', 'onlyNewUnits', true);
    //     EasySearch.changeProperty('nodes', 'onlyHighProspect', true);
    //     EasySearch.changeProperty('nodes', 'orderBy', 'state');
    //     instance.clear();*/
    // },
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "search"
        });
    }
});

FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "dashboard"
        });
    }
});

FlowRouter.route('/content/:contentId', {
    name: 'unitPage',
    // triggersEnter: function() {
    //     Session.set('callStatus', 'doingExercise');
    // },
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "unitPage"
        });
    },
    // triggersExit: function() {
    //     Session.set('callStatus', 'doingExercise');
    // },
});

FlowRouter.route('/content/:contentId/edit', {
    name: 'unitEdit',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "unitEdit"
        });
    }
});

FlowRouter.route('/concept/:conceptId', {
    name: 'conceptPage',
    /*
        subscriptions: function(params) {
            this.register("singleNode", Meteor.subscribe("singleNode",conceptId,Meteor.userId()));
            //this.register("nodes", Meteor.subscribe("nodes"));
            //this.register("edges", Meteor.subscribe("edges"));
            //this.register("sets", Meteor.subscribe("sets"));
            //this.register("personal", Meteor.subscribe("personal"));
        },*/
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "conceptPage"
        });
    }
});

FlowRouter.route('/concept/:conceptId/edit', {
    name: 'conceptEdit',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "conceptEdit"
        });
    }
});

FlowRouter.route('/create/concept', {
    name: 'conceptCreate',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "createConcept"
        });
    }
});

FlowRouter.route('/create/content', {
    name: 'contentCreate',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "createUnit"
        });
    }
});

FlowRouter.route('/goal', {
    name: 'goalPage',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "goalPage"
        });
    }
});
