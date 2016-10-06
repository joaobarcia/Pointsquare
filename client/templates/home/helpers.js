Template.home.helpers({
  mainPageExams: function() {
    var mainPageExams = Nodes.find({
      type: "exam"
    }, {
      limit: 4
    });
    return mainPageExams;
  }
});
// Template.MailChimpListSubscribe.helpers({
//   undesiredMessage: function(message) {
//     console.log(message);
//     if (message == 'Get on the mailing list:') {
//       return true
//     } else return false;
//   }
// });
