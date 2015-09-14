Template._sidebarUserButtons.rendered = function() {
    $(document).ready(function() {
        $('.modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
        });
        $('.tooltipped').tooltip({
            delay: 20
        });
    });
}
