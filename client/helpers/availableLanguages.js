Template.registerHelper('availableLanguages', function() {
  return Nodes.find({
    isLanguage: true
  }).fetch()

});
