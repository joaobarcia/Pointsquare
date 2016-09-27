Template.contentByType.events({
  'click .next-tab': function(event, template) {
    event.preventDefault();
    //console.log(event.target);
    const currentTab = parseInt($(event.target).attr('current-tab'));
    const nextTab = currentTab + 1;
    console.log(nextTab);
    console.log('.unit-tabs .item[data-tab=' + nextTab + ']');
    $('.unit-tabs .item[data-tab=' + nextTab + ']').addClass('active');
    $('.unit-tabs .item').not($('.unit-tabs .item[data-tab=' + nextTab + ']')).removeClass('active');

    $.tab('change tab', nextTab);
  },
  'click .previous-tab': function(event, template) {
    event.preventDefault();
    //console.log(event.target);
    const currentTab = parseInt($(event.target).attr('current-tab'));
    const nextTab = currentTab - 1;
    $.tab('change tab', nextTab);
  }
});
