Template.search.events({
    'click #searchBoth': function() {
        var instance = EasySearch.getComponentInstance({
            index: 'knowledge'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('knowledge', 'filteredClasses', []);
        // Trigger the search again, to reload the new products
        instance.triggerSearch();


        $("#searchBoth").removeClass("grey-text");
        $("#searchBoth").addClass("cyan lighten-2");

        $("#searchUnits").removeClass("cyan lighten-2");
        $("#searchUnits").addClass("grey-text");

        $("#searchConcepts").removeClass("cyan lighten-2");
        $("#searchConcepts").addClass("grey-text");
    },
    'click #searchUnits': function() {

        var instance = EasySearch.getComponentInstance({
            index: 'knowledge'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('knowledge', 'filteredClasses', ['Unit']);
        // Trigger the search again, to reload the new products
        instance.triggerSearch();

        $("#searchBoth").removeClass("cyan lighten-2");
        $("#searchBoth").addClass("grey-text");

        $("#searchUnits").removeClass("grey-text");
        $("#searchUnits").addClass("cyan lighten-2");

        $("#searchConcepts").removeClass("cyan lighten-2");
        $("#searchConcepts").addClass("grey-text");
    },
    'click #searchConcepts': function() {
        var instance = EasySearch.getComponentInstance({
            index: 'knowledge'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('knowledge', 'filteredClasses', ['Concept']);
        // Trigger the search again, to reload the new products
        instance.triggerSearch();

        $("#searchBoth").removeClass("cyan lighten-2");
        $("#searchBoth").addClass("grey-text");

        $("#searchUnits").removeClass("cyan lighten-2");
        $("#searchUnits").addClass("grey-text");

        $("#searchConcepts").removeClass("grey-text");
        $("#searchConcepts").addClass("cyan lighten-2");
    },
});
