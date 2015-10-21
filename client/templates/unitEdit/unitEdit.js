Template.unitEdit.rendered = function() {
    $(document).ready(function() {
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
};

Template.unitEdit.events({
    'click #deleteUnit': function(event) {
        event.preventDefault();
        var rid = Template.currentData().rid;
        Session.set("callStatus", "submitting unit");
        Meteor.call('removeNode', rid, function(error, result) {
            Router.go('/dashboard');
            Session.set("callStatus", "submitted");
        });
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
    _.remove(tempContent, {
        type: 'unitEvaluationSection'
    });
    Session.set('tempContent', tempContent);

    applySort(); // apply once the template is loaded
    applyDropdown();
    Tracker.autorun(function() { // apply on every change of Session.get('tempContent')
        var tempContent = Session.get('tempContent'); // must call Session (even if not used) to make function reactive
        $(document).ready(function() {
            applySort();
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
            var unitRID = this.formAttributes.unitRID;
            var properties = {};
            console.log(doc.name);
            properties.name = doc.name; // fetch autoform input as necessary by createUnit method(properties, necessary, granted)
            console.log(properties.name);
            properties.description = "";
            if (typeof doc.description != "undefined") { // in case description has not been filled, leave blank
                properties.description = doc.description;
            };

            console.log(String(properties.description));
            var content = Session.get('tempContent'); // fetch content
            var evaluation = { // create evaluation object
                "type": "unitEvaluationSection"
            };
            evaluation.evaluationType = doc.evaluationType; // define evaluation type from autoform
            if (doc.evaluationType == "exerciseRadioButton") { // add options or answers to evaluation
                evaluation.question = doc.exerciseRadioButton.question;
                evaluation.options = doc.exerciseRadioButton.options;
            } else if (doc.evaluationType == "exerciseString") {
                evaluation.question = doc.exerciseString.question;
                evaluation.answers = doc.exerciseString.answers;
            };

            content.push(evaluation); // push evaluation object into content array
            content = JSON.stringify(content);
            properties.content = content; // insert content object into properties object


            var requiredConceptsArray = [];
            if (typeof doc.requiredConcepts != "undefined") {
                var requiredConceptsElement = {};
                _.forEach(doc.requiredConcepts, function(n) {
                    requiredConceptsElement[n] = 1
                });
                requiredConceptsArray.push(requiredConceptsElement);
            };

            console.log(properties);
            var grantedConcepts = [];
            if (typeof doc.grantedConcepts != "undefined") {
                var grantedConcepts = doc.grantedConcepts;
            };
            Session.set("callStatus", "submitting unit");
            Meteor.call('editUnit', unitRID, properties, requiredConceptsArray, grantedConcepts, function(error, result) {
                console.log(result);
                Session.set("callStatus", "submitted");
                Router.go('/unit/' + encodeURIComponent(result));
            });

            this.done();
            return false;
        }
    }
});
