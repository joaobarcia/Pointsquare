Template.extraUserRegistrationFields.rendered = function () {
  $(".languages").selectize().on("change", function(e) {
    // mostly used event, fired to the original element when the value changes
    $('#at-field-'+e.target.id.substr(2)).val(e.val);
  });
};

Template.languages.rendered = function () {
  $(".languages").selectize().on("change", function(e) {
    console.log("CHANGED");
    // mostly used event, fired to the original element when the value changes
    console.log($(".languages").selectize()[0].selectize.getValue());
    $('#at-field-'+e.target.id).val(e.val);
  });
};
