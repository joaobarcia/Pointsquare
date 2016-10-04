Template.home.onCreated(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      if (!Session.equals("alreadyClosedNotification", true)) {
        toastr.info('Pointsquare is in beta. This means you will probably find some bugs. Help us find them! Blah Blah!', '', {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": true,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "0",
          "extendedTimeOut": "0",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut",
          "onclick": function() {
            Session.set("alreadyClosedNotification", true);
          },
          "onCloseClick": function() {
            Session.set("alreadyClosedNotification", true);
          }
        })
      }
    }
  });
});

function mapNodesToSemanticSearch(node) {
  node.title = node.name;
  if (node.type == 'content') node.type = 'unit';
  node.description = "(" + node.type + ") " + node.description;
};

Template.home.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      const allNodes = Nodes.find({
        isUnitFromModule: {
          $ne: true
        }
      }, {
        fields: {
          name: 1,
          type: 1,
          description: 1
        }
      }).fetch();
      // const semanticSearchNodes = _.map(allNodes, mapNodesToSemanticSearch);
      _.map(allNodes, mapNodesToSemanticSearch);
      // var content = [{
      //   title: 'Horse 1',
      //   description: 'An Animal',
      //   actionURL: 'google.com'
      // }, {
      //   title: 'Cow 2',
      //   description: 'Another Animal',
      // }];

      $('.ui.search')
        .search({
          source: allNodes,
          onSelect: function(result, response) {
            const nodeId = result._id;
            if (result.type == 'exam') {
              FlowRouter.go('/exam/' + nodeId);
            } else if (result.type == 'unit') {
              FlowRouter.go('/content/' + nodeId);
            } else if (result.type == 'concept') {
              toastr.info("Concepts don't have their own page yet");
            }
          }

        });;
    }
  });
});
