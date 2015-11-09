Router.route('/', {
    name: 'home',
    onRun: function() {
        Session.set('callStatus', 'OK');
        this.next();
    },
    // tests
    waitOn: function() {
        return [Meteor.subscribe('tests'), Meteor.subscribe('people')];
    },
});

Router.route('/search', {
    name: 'search',
    waitOn: function() {
        /*
                if (Meteor.user()) {
                    return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
                } else {
                    return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
                };*/
        return Meteor.subscribe('knowledge_network');

    },
    onRun: function() {
        Session.set('callStatus', 'OK');
        this.next();
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
});

Router.route('/unit/:_escrid', {
    name: 'unitPage',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    data: function() {
        var rid = decodeURIComponent(this.params._escrid);
        return knowledge.findOne({
            rid: rid
        }, {
            reactive: false
        });
    },
    onRun: function() {
        Session.set('callStatus', 'doingExercise');
        if (Meteor.userId()) {
            console.log(Session.get('callStatus'));
            var unit = decodeURIComponent(this.params._escrid);
            var user = Session.get('currentUserRID');
            Session.set("temp", "precomputing");
            Meteor.call('precompute', unit, function(error, result) {
                if (result.statusCode >= 200 && result.statusCode < 300) {
                    Session.set("temp", "ready");
                    console.log('ready to learn');
                    // if( Session.get('callStatus') == 'doingExercise' ){
                    //     return result;
                    // }
                    if (Session.get('callStatus') == 'learning') {
                        Meteor.call("succeed", unit, function(error, result) {
                            if (result.statusCode >= 200 && result.statusCode < 300) {
                                Session.set('callStatus', 'learned');
                            }
                            var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
                            Session.set('newConcepts', newStuff[1]);
                            Session.set('newUnits', newStuff[0]);
                        });
                        Meteor.call("incrementViews", unit);
                    } else if (Session.get('callStatus') == 'unlearning') {
                        Meteor.call("fail", unit, function(error, result) {
                            if (result.statusCode >= 200 && result.statusCode < 300) {
                                Session.set('callStatus', 'unlearned');
                            }
                            var newStuff = result.data.result[0]['value'] //["content"];//["result"];//[0]["value"];
                            Session.set('lostConcepts', newStuff[3]);
                            Session.set('lostUnits', newStuff[2]);
                        });
                        Meteor.call("incrementViews", unit);
                    };
                }
            });
        }
        this.next();
    },
    onStop: function() {
        Session.set('callStatus', 'OK')
    }
});

Router.route('/unit/:_escrid/edit', {
    name: 'unitEdit',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    data: function() {
        var rid = decodeURIComponent(this.params._escrid);
        return knowledge.findOne({
            rid: rid
        }, {
            reactive: false
        });
    },
    onRun: function() {
        Session.set("callStatus", "editing unit");
        //Session
        this.next();
    },
    onStop: function() {
        Session.set("callStatus", "OK");
    }
});


Router.route('/concept/:_escrid', {
    name: 'conceptPage',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    data: function() {
        var rid = decodeURIComponent(this.params._escrid);
        return knowledge.findOne({
            rid: rid
        }, {
            reactive: false
        });
    }
});

Router.route('/concept/:_escrid/edit', {
    name: 'conceptEdit',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    data: function() {
        var rid = decodeURIComponent(this.params._escrid);
        return knowledge.findOne({
            rid: rid
        }, {
            reactive: false
        });
    },
    onRun: function() {
        Session.set("callStatus", "editing concept");
        this.next();
    },
    onStop: function() {
        Session.set("callStatus", "OK");
    }
});

Router.route('/dashboard', {
    name: 'dashboard',
    /*    waitOn: function() {
            if (Meteor.user()) {
                return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
            } else {
                return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
            };
        }*/
});

Router.route('/create', {
    name: 'create',
    waitOn: function() {
        return Meteor.subscribe('user_names')
    }
});

Router.route('/create/unit', {
    name: 'createUnit',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    onRun: function() {
        Session.set("callStatus", "editing unit");
        Session.set("tempContent", null);
        this.next();
    },
    onStop: function() {
        Session.set("callStatus", "OK");
    }
});

Router.route('/create/concept', {
    name: 'createConcept',
    waitOn: function() {
        if (Meteor.user()) {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('user_info'), Meteor.subscribe('knowledge_network')];
        } else {
            return [Meteor.subscribe('user_names'), Meteor.subscribe('knowledge_network')];
        };
    },
    onRun: function() {
        Session.set("callStatus", "editing concept");
        this.next();
    },
    onStop: function() {
        Session.set("callStatus", "OK");
    }
});

Router.plugin('ensureSignedIn', {
    only: ['dashboard', 'create', 'createUnit', 'createConcept', 'conceptEdit', 'unitEdit']
});
