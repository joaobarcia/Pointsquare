Schema = {};

Schema.createUnit = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 50
    },
    description: {
        type: String,
        label: "Description",
        max: 800,
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },
    requiredConcepts: {
        type: [String],
        label: "Concepts necessary to understand the unit",
        autoform: {
            type: "selectize",
            multiple: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name
                    newObject.value = n.rid
                    return newObject
                }
                return lodash.map(knowledge.find({
                    class: 'Concept'
                }).fetch(), nameAndRID);
            }
        }
    },
    grantedConcepts: {
        type: [String],
        label: "Concepts the unit will teach",
        autoform: {
            type: "selectize",
            multiple: true,
            options: function() {
                // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
                function nameAndRID(n) {
                    var newObject = {};
                    newObject.label = n.name
                    newObject.value = n.rid
                    return newObject
                }
                return lodash.map(knowledge.find({
                    class: 'Concept'
                }).fetch(), nameAndRID);
            }
        }
    },
    type: {
        type: Boolean,
        autoform: {
            label: false,
            type: 'boolean-radios',
            falseLabel: "result of last exercise determines if user understood",
            trueLabel: "user chooses if he understood the unit"

        }
    }

});
