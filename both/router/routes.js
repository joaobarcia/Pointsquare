FlowRouter.route('/', {
    name: 'home',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "home_new"
        });
    }
});

FlowRouter.route('/exam/:examId', {
    name: 'examPage',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "examPage"
        });
    }
});

FlowRouter.route('/create/exam', {
    name: 'examCreate',
    action: function(params) {
        BlazeLayout.render("mainLayout", {
            main: "createExam"
        });
    }
});
// WARNING: END OF NEW ROUTES

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
