FlowRouter.route('/', {
    name: 'home',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "home"
        });
    }
});

FlowRouter.route('/home_new', {
    name: 'home_new',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "home_new"
        });
    }
});

FlowRouter.route('/exam', {
    name: 'exam',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "exam"
        });
    }
});

FlowRouter.route('/search', {
    name: 'search',
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
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "unitPage"
        });
    }
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
