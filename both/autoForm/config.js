Schema = {};

Schema.Concept = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 150
    },
    description: {
        type: String,
        label: "Description",
        max: 800,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },
    needs: {
        type: Array,
        optional: true,
    },
    "needs.$": {
        type: [String],
        label: " _",
        optional: true,
        autoform: {
            type: "selectize",
            multiple: true,
            isReactiveOptions: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name;
                    newObject.value = n._id;
                    return newObject;
                };

                var conceptsMappedToSelectize = _.map(Nodes.find({
                    type: 'concept'
                }).fetch(), nameAndRID);

                return conceptsMappedToSelectize;
            }
        }
    },
});


Schema.Unit = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 150
    },
    description: {
        type: String,
        label: "Description",
        max: 800,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },
    needs: {
        type: Array,
        optional: true,
    },
    "needs.$": {
        type: [String],
        label: " _",
        optional: true,
        autoform: {
            type: "selectize",
            multiple: true,
            isReactiveOptions: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name;
                    newObject.value = n._id;
                    return newObject;
                };

                var conceptsMappedToSelectize = _.map(Nodes.find({
                    type: 'concept'
                }).fetch(), nameAndRID);

                return conceptsMappedToSelectize;
            }
        }
    },
    grants: {
        type: [String],
        label: " _",
        optional: true,
        autoform: {
            type: "selectize",
            multiple: true,
            isReactiveOptions: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name;
                    newObject.value = n._id;
                    return newObject;
                };

                var conceptsMappedToSelectize = _.map(Nodes.find({
                    type: 'concept'
                }).fetch(), nameAndRID);

                return conceptsMappedToSelectize;
            }
        }
    },
    evaluationType: {
        type: String,
        autoform: {
            type: "select-radio-inline",
            options: function() {
                return [{
                    label: "User decides if unit was understood",
                    value: "userConfirmation"
                }, {
                    label: "Multiple Choice",
                    value: "exerciseRadioButton"
                }, {
                    label: "Question and answer",
                    value: "exerciseString"
                }];
            }
        }
    },
    exerciseRadioButton: {
        type: Object,
        optional: true,
        minCount: 0,
        maxCount: 5
    },
    "exerciseRadioButton.question": {
        type: String,
    },
    "exerciseRadioButton.options": {
        type: Array,
        optional: true,
        minCount: 0,
        maxCount: 5
    },
    "exerciseRadioButton.options.$": {
        type: Object
    },
    "exerciseRadioButton.options.$.label": {
        label: "Option text",
        type: String
    },
    "exerciseRadioButton.options.$.isCorrectOption": {
        type: String,
        autoform: {
            type: "select-radio-inline",
            options: function() {
                return [{
                    label: "true",
                    value: "true"
                }, {
                    label: "false",
                    value: "false"
                }];
            }
        }
    },
    exerciseString: {
        type: Object,
        optional: true,
        minCount: 0,
        maxCount: 5
    },
    "exerciseString.question": {
        type: String,
    },
    "exerciseString.answers": {
        type: Array,
        optional: true,
        minCount: 0,
        maxCount: 5
    },
    "exerciseString.answers.$": {
        type: String,
    }
});
