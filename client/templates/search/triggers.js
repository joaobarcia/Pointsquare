Template.search.onRendered(function() {
  NodesSearchIndex.getComponentMethods().addProps('type', 'exam');

  var template = this;
  let dict = NodesSearchIndex.getComponentDict();
  template.autorun(function() {
    // this line sets up a reactive dependency on the "searching" key
    // so this code will be re-run anytime it changes
    let searching = dict.get("searching");
    let options = dict.get("searchOptions");

    // if we are not seearching, run the function
    // you can also refer to other dict keys (e.g. dict.get("currentCount")) to add more conditions
    if (!searching) {
      // WARNING: timeout to make sure all results are displayed. Very non-elegant
      setTimeout(function() {
        $('.ui.sticky')
          .sticky({
            offset: 70,
            context: '#context'
          });
      }, 500);

    }
  });
});

Template.search.events({
  'click #search-menu .item': function(event, template) {
    $(event.target).addClass('active');
    $('#search-menu .item').not($(event.target)).removeClass('active');
    $("html, body").animate({
      scrollTop: 0
    });
    //$('#search-menu .item').not(this).removeClass('active');
    //$(this).addClass('active');
  },
  'click #searchExams': function() {
    NodesSearchIndex.getComponentMethods().addProps('type', 'exam');

    // $("#searchExams").removeClass("grey-text").addClass("cyan lighten-2");
    // $("#searchUnits").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchConcepts").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchAll").removeClass("cyan lighten-2").addClass("grey-text");
  },
  'click #searchUnits': function() {
    NodesSearchIndex.getComponentMethods().addProps('type', 'content');

    // $("#searchExams").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchUnits").removeClass("grey-text").addClass("cyan lighten-2");
    // $("#searchConcepts").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchAll").removeClass("cyan lighten-2").addClass("grey-text");
  },
  'click #searchConcepts': function() {
    NodesSearchIndex.getComponentMethods().addProps('type', 'concept');

    // $("#searchExams").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchUnits").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchConcepts").removeClass("grey-text").addClass("cyan lighten-2");
    // $("#searchAll").removeClass("cyan lighten-2").addClass("grey-text");
  },
  'click #searchAll': function() {
    NodesSearchIndex.getComponentMethods().removeProps('type');

    // $("#searchExams").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchUnits").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchConcepts").removeClass("cyan lighten-2").addClass("grey-text");
    // $("#searchAll").removeClass("grey-text").addClass("cyan lighten-2");
  },
  // 'click #sortState': function() {
  //     NodesSearchIndex.getComponentMethods().addProps('sortBy', 'state');
  // },
  // 'click #sortName': function() {
  //     NodesSearchIndex.getComponentMethods().addProps('sortBy', 'name');
  // },
  // 'click #sortViews': function() {
  //     var instance = EasySearch.getComponentInstance({
  //         index: 'nodes'
  //     });
  //
  //     // Change the currently filteredCategories like this
  //     EasySearch.changeProperty('nodes', 'orderBy', 'views');
  //     // Trigger the search again, to reload the new products
  //     instance.triggerSearch();
  // },
  // 'click #onlyNewUnits': function(event, template) {
  //     var instance = EasySearch.getComponentInstance({
  //         index: 'nodes'
  //     });
  //     switchStatus = template.$('#onlyNewUnits').is(":checked");
  //     // Change the value of the onlyNewUnits prop of easySearch
  //     if (switchStatus) {
  //         console.log("CHECKED!");
  //         EasySearch.changeProperty('nodes', 'onlyNewUnits', true);
  //     } else {
  //         console.log("NOT CHECKED!");
  //         EasySearch.changeProperty('nodes', 'onlyNewUnits', false);
  //     };
  //
  //     // Trigger the search again, to reload the new products
  //     instance.triggerSearch();
  // },
  // 'click #onlyHighProspect': function(event, template) {
  //     var instance = EasySearch.getComponentInstance({
  //         index: 'nodes'
  //     });
  //     switchStatus = template.$('#onlyHighProspect').is(":checked");
  //     // Change the value of the onlyNewUnits prop of easySearch
  //     if (switchStatus) {
  //         console.log("CHECKED!");
  //         EasySearch.changeProperty('nodes', 'onlyHighProspect', true);
  //     } else {
  //         console.log("NOT CHECKED!");
  //         EasySearch.changeProperty('nodes', 'onlyHighProspect', false);
  //     };
  //
  //     // Trigger the search again, to reload the new products
  //     instance.triggerSearch();
  // },
});
