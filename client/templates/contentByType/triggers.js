Template.contentByTypeWrapper.events({
  'click .next-tab': function(event, template) {
    event.preventDefault();
    const currentTab = parseInt($(event.target).attr('current-tab'));
    // console.log(currentTab);
    const desiredTab = currentTab + 1;
    // console.log(desiredTab);
    const desiredTabSelector = $('.unit-tabs .item[data-tab=' + desiredTab + ']');
    // console.log(desiredTabSelector);

    $.tab('change tab', desiredTab);

    desiredTabSelector.addClass('active');
    $('.unit-tabs .item').not(desiredTabSelector).removeClass('active');

  },
  'click .previous-tab': function(event, template) {
    event.preventDefault();
    //console.log(event.target);
    const currentTab = parseInt($(event.target).attr('current-tab'));
    // console.log(currentTab);
    const desiredTab = currentTab - 1;
    const desiredTabSelector = $('.unit-tabs .item[data-tab=' + desiredTab + ']');
    // console.log(desiredTab);
    // console.log(desiredTabSelector);

    $.tab('change tab', desiredTab);

    desiredTabSelector.addClass('active');
    $('.unit-tabs .item').not(desiredTabSelector).removeClass('active');

  }
});

Template.exerciseString.onRendered(function() {
  Tracker.autorun(function() {
    // console.log('entrou no contentbytype')
    $("#exerciseStringField").removeClass("disabled");
    $("#exerciseButton").removeClass("red").removeClass("green").removeClass("disabled");
    $("#exerciseInputText").removeClass("red text").removeClass("green text");
  });
})

Template.contentByType.onRendered(function() {
    this.autorun(() => {
      if (this.subscriptionsReady()) {
        // WARNING: 1 - TIMEOUT SHOULDN'T BE DONE. 2 - TWO TIMEOUTS ARE EVEN WORSE, BUT ONE HANDLES QUICK LOADED PAGES AND OTHER REFRESHES 3 - This is a duplicate of code running on unitPage triggers. Should be corrected
        setTimeout(function() {
          $('.ui.embed').embed();
          $.tab();
          $('.unit-tabs .item').tab();
          // set first tab as active
          $("[data-tab=1]").addClass('active');
          $('.ui.checkbox').checkbox();
        }, 50);
        setTimeout(function() {
          $('.ui.embed').embed();
          $.tab();
          $('.unit-tabs .item').tab();
          // set first tab as active
          $("[data-tab=1]").addClass('active');
          $('.ui.checkbox').checkbox();
          $("#exerciseStringField").removeClass("disabled");
          $("#exerciseButton").removeClass("red").removeClass("green").removeClass("disabled");
          $("#exerciseInputText").removeClass("red text").removeClass("green text");
        }, 300);
      }
    })
});
