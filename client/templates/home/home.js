Template.home.rendered = function() {
    $(document).ready(function() {
        $('.parallax').parallax();
        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    });
};
