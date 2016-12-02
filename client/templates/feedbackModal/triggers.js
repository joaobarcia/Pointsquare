Template.feedbackModalContent.events({
  'click #sendFeedback': function(event) {
    event.preventDefault();
    const sender = $('#feedbackEmail')[0].value;
    const msg = $('#feedbackMessage')[0].value;
    const availableForContact = $('#feedbackContact')[0].value;
    const emailContents = "Sender: " + sender + " | " + "Message: " + msg + " | " + "Available for contact: " + availableForContact;
    Meteor.call('sendFeedbackEmail',
      'joaobarcia@gmail.com', 'contact@pointsquare.org',
      'Pointsquare - Website Feedback Email', emailContents);

    toastr.info('Thanks! :)');

    $('#feedbackEmail')[0].value = "";
    $('#feedbackMessage')[0].value = "";
    $('#feedbackContact')[0].value = "";
  }
});

Template.feedbackModalContent.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      $('.ui.checkbox').checkbox()
    }
  });
});
