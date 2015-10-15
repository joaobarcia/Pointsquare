// extremely unsafe security-wise. must re-do
Template.registerHelper('unescape', function(string) {
    var unescapedString = unescape(string);
    return unescapedString;
});
