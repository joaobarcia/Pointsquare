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
    childConcepts: {
        type: [String],
        label: " ",
        optional: true,
        autoform: {
            type: "selectize",
            multiple: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name
                    newObject.value = n._id
                    return newObject
                }
                return lodash.map(Nodes.find({
                    type: 'concept'
                }).fetch(), nameAndRID);
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
    requiredConcepts: {
        type: [String],
        label: " blergh",
        optional: true,
        autoform: {
            type: "selectize",
            multiple: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                /*function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name
                    newObject.value = n._id
                    return newObject
                }
                return lodash.map(Nodes.find({
                    type: 'concept'
                }).fetch(), nameAndRID);*/
                return [{
                    label: "2013",
                    value: 2013
                }, {
                    label: "2014",
                    value: 2014
                }, {
                    label: "2015",
                    value: 2015
                }];
            }
        }
    },
    grantedConcepts: {
        type: [String],
        label: " blargh",
        optional: true,
        autoform: {
            type: "typeahead",
            multiple: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                /*                function nameAndRID(n) {
                                    var newObject = {};
                                    newObject.label = n.name
                                    newObject.value = n._id
                                    return newObject
                                }
                                return lodash.map(Nodes.find({
                                    type: 'concept'
                                }).fetch(), nameAndRID);*/
                return [{
                    label: "2013",
                    value: 2013
                }, {
                    label: "2014",
                    value: 2014
                }, {
                    label: "2015",
                    value: 2015
                }];
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
