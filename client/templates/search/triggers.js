//Fixed search options
/*Template.search.rendered = function() {
    $(document).ready(function() {
        console.log("entrou!");
        $('.toc-wrapper .row').pushpin({
            top: $('.toc-wrapper').offset().top
        });
    });
}*/

Template.search.onCreated(function() {
    var self = this;
    self.autorun(function() {
        //var postId = FlowRouter.getParam('postId');
        self.subscribe('nodes');
    });
});

Template.search.events({
    'click #searchBoth': function() {
        var instance = EasySearch.getComponentInstance({
            index: 'nodes'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('nodes', 'filteredClasses', []);
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
            index: 'nodes'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('nodes', 'filteredClasses', ['content']);
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
            index: 'nodes'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('nodes', 'filteredClasses', ['concept']);
        // Trigger the search again, to reload the new products
        instance.triggerSearch();

        $("#searchBoth").removeClass("cyan lighten-2");
        $("#searchBoth").addClass("grey-text");

        $("#searchUnits").removeClass("cyan lighten-2");
        $("#searchUnits").addClass("grey-text");

        $("#searchConcepts").removeClass("grey-text");
        $("#searchConcepts").addClass("cyan lighten-2");
    },
    'click #sortState': function() {
        var instance = EasySearch.getComponentInstance({
            index: 'nodes'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('nodes', 'orderBy', 'state');
        // Trigger the search again, to reload the new products
        instance.triggerSearch();
    },
    'click #sortName': function() {
        var instance = EasySearch.getComponentInstance({
            index: 'nodes'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('nodes', 'orderBy', 'name');
        // Trigger the search again, to reload the new products
        instance.triggerSearch();
    },
    'click #sortViews': function() {
        var instance = EasySearch.getComponentInstance({
            index: 'nodes'
        });

        // Change the currently filteredCategories like this
        EasySearch.changeProperty('nodes', 'orderBy', 'views');
        // Trigger the search again, to reload the new products
        instance.triggerSearch();
    },
    'click #onlyNewUnits': function(event, template) {
        var instance = EasySearch.getComponentInstance({
            index: 'nodes'
        });
        switchStatus = template.$('#onlyNewUnits').is(":checked");
        // Change the value of the onlyNewUnits prop of easySearch
        if (switchStatus) {
            console.log("CHECKED!");
            EasySearch.changeProperty('nodes', 'onlyNewUnits', true);
        } else {
            console.log("NOT CHECKED!");
            EasySearch.changeProperty('nodes', 'onlyNewUnits', false);
        };

        // Trigger the search again, to reload the new products
        instance.triggerSearch();
    },
    'click #onlyHighProspect': function(event, template) {
        var instance = EasySearch.getComponentInstance({
            index: 'nodes'
        });
        switchStatus = template.$('#onlyHighProspect').is(":checked");
        // Change the value of the onlyNewUnits prop of easySearch
        if (switchStatus) {
            console.log("CHECKED!");
            EasySearch.changeProperty('nodes', 'onlyHighProspect', true);
        } else {
            console.log("NOT CHECKED!");
            EasySearch.changeProperty('nodes', 'onlyHighProspect', false);
        };

        // Trigger the search again, to reload the new products
        instance.triggerSearch();
    },
});
