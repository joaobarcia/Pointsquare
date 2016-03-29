Template.search.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('userNames');
    });
    self.subscribe('nodes');
    self.subscribe('personal');
    self.subscribe('goals');
});

Template.search.rendered = function() {
    //Fixed search options
    /*    $(document).ready(function() {
            console.log("entrou!");
            $('.toc-wrapper .row').pushpin({
                top: $('.toc-wrapper').offset().top
            });
        });*/

    NodesSearchIndex.getComponentMethods().addProps('type', 'concept');
    //NodesSearchIndex.getComponentMethods().addProps('sortBy', 'state');
};

Template.search.events({
    'click #searchBoth': function() {
        NodesSearchIndex.getComponentMethods().removeProps('type');

        $("#searchBoth").removeClass("grey-text");
        $("#searchBoth").addClass("cyan lighten-2");

        $("#searchUnits").removeClass("cyan lighten-2");
        $("#searchUnits").addClass("grey-text");

        $("#searchConcepts").removeClass("cyan lighten-2");
        $("#searchConcepts").addClass("grey-text");
    },
    'click #searchUnits': function() {
        NodesSearchIndex.getComponentMethods().addProps('type', 'content');

        $("#searchBoth").removeClass("cyan lighten-2");
        $("#searchBoth").addClass("grey-text");

        $("#searchUnits").removeClass("grey-text");
        $("#searchUnits").addClass("cyan lighten-2");

        $("#searchConcepts").removeClass("cyan lighten-2");
        $("#searchConcepts").addClass("grey-text");
    },
    'click #searchConcepts': function() {
        NodesSearchIndex.getComponentMethods().addProps('type', 'concept');

        $("#searchBoth").removeClass("cyan lighten-2");
        $("#searchBoth").addClass("grey-text");

        $("#searchUnits").removeClass("cyan lighten-2");
        $("#searchUnits").addClass("grey-text");

        $("#searchConcepts").removeClass("grey-text");
        $("#searchConcepts").addClass("cyan lighten-2");
    },
    'click #sortState': function() {
        NodesSearchIndex.getComponentMethods().addProps('sortBy', 'state');
    },
    'click #sortName': function() {
        NodesSearchIndex.getComponentMethods().addProps('sortBy', 'name');
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
