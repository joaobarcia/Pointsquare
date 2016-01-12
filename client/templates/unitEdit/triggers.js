function needsAsJSONSession() {
    //console.log('needsAsJSONSession');
    var id = FlowRouter.getParam('conceptId');
    var requirements = Requirements.find({
        node: id
    }).fetch();
    var json = [];
    for (var i = 0; i < requirements.length; i++) {
        var requirement = requirements[i];
        var requirementId = requirement._id;
        var info = Personal.findOne({
            node: requirementId
        });
        var state = info ? info.state : 0;
        var contains = [];
        var subconcepts = requirement.weights;
        for (var subconceptId in subconcepts) {
            var subObj = {};
            var subconcept = Nodes.findOne(subconceptId);
            subObj["_id"] = subconceptId;
            subObj["name"] = subconcept.name;
            subObj["description"] = subconcept.description;
            var subinfo = Personal.findOne({
                node: subconceptId,
                user: Meteor.userId()
            });
            var substate = subinfo ? subinfo.state : 0;
            contains.push(subObj);
        }
        var obj = {};
        obj["_id"] = requirementId;
        obj["state"] = state;
        obj["contains"] = contains;
        json.push(obj);
    }
    Session.set("needsObject", json)
};

Template.unitEdit.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var nodeId = FlowRouter.getParam('contentId');
        self.subscribe('singleContent', nodeId);
    });
});

Template.unitEdit.rendered = function() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            $('.tooltipped').tooltip({
                delay: 20
            });
            //console.log('conceptEdit rendered > subs ready');
            needsAsJSONSession();
            var deletedNeedsSets = [];
            Session.set('deletedNeedsSets', deletedNeedsSets);
        }
    })
};

Template.unitEdit.events({
    'click #deleteUnit': function(event) {
        event.preventDefault();
        var nodeId = FlowRouter.getParam('contentId');
        Meteor.call('removeNode', nodeId);
        FlowRouter.go('dashboard');
    },
});

function applySort() { // must apply sort and dropdown properties everytime the content is changed
    Sortable.create(document.getElementById('content-sections'), {
        animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
        draggable: '.section-card', // Restricts sort start click/touch to the specified element
        handle: '.section-handle', // Specifies which items inside the element should be sortable
        onEnd: function(evt) { // When sections are moved, propagate information to session variable
            console.log(evt.oldIndex);
            console.log(evt.newIndex);
            var tempContent = Session.get('tempContent');
            console.log(tempContent);
            tempContent.move(evt.oldIndex, evt.newIndex);
            console.log(tempContent);
            Session.set('tempContent', tempContent);
        },
        disabled: true,
    });

    [].forEach.call(document.getElementById('content-sections').getElementsByClassName('content-fields'), function(el) {
        Sortable.create(el, {
            group: 'contents',
            animation: 150,
            draggable: ".collection-item",
            handle: '.content-handle',
            disabled: true,
        });
    });
};

function applyDropdown() { // jquery was being called before the changes were propagated to the DOM
    var sectionsInJSON = Session.get('tempContent').length;
    var sectionsInHTML = $('.dropdown-button.add-content').length;
    if (sectionsInJSON == sectionsInHTML) { // if the changes have been propagated, call jquery
        $('.dropdown-button.add-content').dropdown({
            inDuration: 300,
            outDuration: 225,
            //constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            //gutter: 0, // Spacing from edge
            //belowOrigin: false, // Displays dropdown below the button
            //alignment: 'left' // Displays dropdown with edge aligned to the left of button
        })
    } else {
        setTimeout(applyDropdown, 50); // re-run function asynchronously until conditions are met
    };
};

Template.unitEditContent.rendered = function() {
    var tempContent = Template.currentData().content;
    //console.log(Template.currentData());
    //console.log(tempContent);
    _.remove(tempContent, {
        type: 'unitEvaluationSection'
    });
    //console.log(tempContent);
    Session.set('tempContent', tempContent);

    /*    this.autorun(() => {
            if (Template.instance().parent(1).subscriptionsReady()) {
                applySort(); // apply once the template is loaded
                applyDropdown();
                Tracker.autorun(function() { // apply on every change of Session.get('tempContent')
                    var tempContent = Session.get('tempContent'); // must call Session (even if not used) to make function reactive
                    setTimeout(function() {
                        applySort();
                        applyDropdown();;
                    }, 20);
                });
            };
        })*/
    //applySort(); // apply once the template is loaded
    applyDropdown();
    Tracker.autorun(function() { // apply on every change of Session.get('tempContent')
        var tempContent = Session.get('tempContent'); // must call Session (even if not used) to make function reactive
        $(document).ready(function() {
            //applySort();
            applyDropdown();
        });
    });
};

Template.unitEditContent.events({
    'click .remove-section': function(event) {
        event.preventDefault();
        var section = event.target.id;
        var tempContent = Session.get('tempContent');
        tempContent.splice(section, 1);
        Session.set('tempContent', tempContent);
    },
    'click .add-section': function(event) {
        event.preventDefault();
        tempContent = Session.get('tempContent')
        tempContent.push({
            "type": "unitSection",
            "subContent": []
        });
        Session.set('tempContent', tempContent);
        console.log('session changed');
    },
    'click .add-text': function(event) {
        event.preventDefault();
        var section = event.target.id;
        var tempContent = Session.get('tempContent');
        tempContent[section].subContent.push({
            "type": "text",
            "text": ""
        });
        Session.set('tempContent', tempContent);
    },
    'click .add-video': function(event) {
        event.preventDefault();
        var section = event.target.id;
        var tempContent = Session.get('tempContent');
        tempContent[section].subContent.push({
            "type": "youtube",
            "youtubeVidID": ""
        });
        Session.set('tempContent', tempContent);
    },
    'click .add-image': function(event) {
        event.preventDefault();
        var section = event.target.id;
        var tempContent = Session.get('tempContent');
        tempContent[section].subContent.push({
            "type": "remoteImage",
            "remoteImgURL": ""
        });
        Session.set('tempContent', tempContent);
    },
    'click .remove-content': function(event) {
        event.preventDefault();
        var arrayOfIds = _.words(event.target.id, /[^, ]+/g); // extract array indexes from @index ids
        var section = arrayOfIds[0];
        var content = arrayOfIds[1];
        var tempContent = Session.get('tempContent');
        tempContent[section].subContent.splice(content, 1);
        Session.set('tempContent', tempContent);
    },
    /* 'submit': function(event) {
         event.preventDefault();
         console.log("entered event");
     },*/
    'input .content-input': function(event) {
        event.preventDefault();
        var arrayOfIds = _.words(event.target.id, /[^, ]+/g); // extract array indexes from @index ids
        var section = arrayOfIds[0];
        var content = arrayOfIds[1];
        var keyToChange = arrayOfIds[2]
        var tempContent = Session.get('tempContent');
        /*if (keyToChange == 'text') { // text strings need to be escaped
            console.log("IT IS TEXT!!!");
            tempContent[section].subContent[content][keyToChange] = escape(event.target.value);
        } else {*/
        tempContent[section].subContent[content][keyToChange] = event.target.value;
        //};
        Session.set('tempContent', tempContent);
    },
});

AutoForm.hooks({
    unitEdit: {
        onSubmit: function(doc) {
            var parameters = doc;

            var nodeId = FlowRouter.getParam('conceptId');

            Meteor.call('editNode', nodeId, parameters);
            var needsObject = Session.get('needsObject');
            //console.log(needsObject);
            _.forEach(needsObject, function(n) {
                var setId = n['_id'];
                var needsAsArrayOfId = $('#' + setId).selectize()[0].selectize.getValue();
                //console.log(needsAsArrayOfId);
                var needsMappedAsArrayofObjects = {};
                for (var n = 0; n < needsAsArrayOfId.length; n += 1) {
                    needsMappedAsArrayofObjects[needsAsArrayOfId[n]] = true;
                };
                //console.log(needsMappedAsArrayofObjects);
                if (_(setId).startsWith('newSet')) {
                    //console.log(needsMappedAsArrayofObjects);
                    Meteor.call('addNeed', nodeId, needsMappedAsArrayofObjects);
                    /*console.log('addNeed for ' + nodeId + ' with' + needsMappedAsArrayofObjects);
                    console.log(needsMappedAsArrayofObjects);*/
                } else {
                    Meteor.call('editNeed', setId, needsMappedAsArrayofObjects);
                };
            });
            FlowRouter.go('/content/' + nodeId);
            this.done();
            return false;
        }
    }
});
