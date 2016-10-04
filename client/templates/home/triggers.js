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
