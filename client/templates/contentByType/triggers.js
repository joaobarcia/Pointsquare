// Template.contentByType.onRendered(function() {
//   this.autorun(() => {
//     if (this.subscriptionsReady()) {
//       setTimeout(function() {
//         $('.ui.embed').embed();
//         $('.unit-tabs .item').tab();
//         // set first tab as active
//         $("[data-tab=1]").addClass('active');
//       }, 20);
//     }
//   });
// });


Template.contentByType.events({
  'click .next-tab': function(event, template) {
    event.preventDefault();
    const currentTab = parseInt($(event.target).attr('current-tab'));
    console.log(currentTab);
    const desiredTab = currentTab + 1;
    console.log(desiredTab);
    const desiredTabSelector = $('.unit-tabs .item[data-tab=' + desiredTab + ']');
    console.log(desiredTabSelector);

    $.tab('change tab', desiredTab);

    desiredTabSelector.addClass('active');
    $('.unit-tabs .item').not(desiredTabSelector).removeClass('active');

  },
  'click .previous-tab': function(event, template) {
    event.preventDefault();
    //console.log(event.target);
    const currentTab = parseInt($(event.target).attr('current-tab'));
    console.log(currentTab);
    const desiredTab = currentTab - 1;
    const desiredTabSelector = $('.unit-tabs .item[data-tab=' + desiredTab + ']');
    console.log(desiredTab);
    console.log(desiredTabSelector);

    $.tab('change tab', desiredTab);

    desiredTabSelector.addClass('active');
    $('.unit-tabs .item').not(desiredTabSelector).removeClass('active');

  }
});
