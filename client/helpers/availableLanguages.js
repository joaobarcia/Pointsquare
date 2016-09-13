Template.registerHelper('availableLanguages', function() {
  return Nodes.find({
    isLanguageConcept: true
  }).fetch()

});
