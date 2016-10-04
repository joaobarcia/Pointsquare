Schema = {};

Schema.Concept = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 220
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  isLanguage: {
    type: Boolean,
    defaultValue: false,
    label: "Concept is a language"
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
        }

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
    max: 220
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  isUnitFromModule: {
    type: Boolean,
    defaultValue: false,
    label: "This Unit should only be presented as part of an Exam"
  },
  language: {
    type: String,
    optional: false,
    label: "Language",
    autoform: {
      type: "select",
      options: function() {
        // return names and rids of concepts in the format [{label: 'name', value:'rid'}]
        function nameAndRID(n) {
          var newObject = {};
          newObject.label = n.name;
          newObject.value = n._id;
          return newObject;
        }

        var conceptsMappedToSelectize = _.map(Nodes.find({
          isLanguage: true
        }).fetch(), nameAndRID);

        return conceptsMappedToSelectize;
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
        }

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
        }

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
          label: "Multiple Choice Answer",
          value: "exerciseRadioButton"
        }, {
          label: "Multiple Choice Image",
          value: "exerciseImageSelection"
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
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    },
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
    type: String,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    },
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
  exerciseImageSelection: {
    type: Object,
    optional: true,
    minCount: 0,
    maxCount: 5
  },
  "exerciseImageSelection.question": {
    type: String,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    },
  },
  "exerciseImageSelection.options": {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 5
  },
  "exerciseImageSelection.options.$": {
    type: Object
  },
  "exerciseImageSelection.options.$.imgURL": {
    label: "Image URL",
    type: String
  },
  "exerciseImageSelection.options.$.isCorrectOption": {
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
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
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

Schema.Exam = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 220
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  exercises: {
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
        }

        var contentsMappedToSelectize = _.map(Nodes.find({
          type: 'content'
        }).fetch(), nameAndRID);

        return contentsMappedToSelectize;
      }
    }
  },
});
