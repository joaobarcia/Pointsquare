Template.feedbackModalContent.events({
  'click #sendFeedback': function(event) {
    event.preventDefault();
    const sender = $('#feedbackEmail')[0].value;
    const msg = $('#feedbackMessage')[0].value;
    const availableForContact = $('#feedbackContact')[0].value;
    const emailContents = "Sender: " + sender + "<br>" + "Message: " + msg + "<br>" + "Available for contact: " + availableForContact;
    Meteor.call('sendFeedbackEmail',
      'joaobarcia@gmail.com', 'contact@pointsquare.org',
      'Pointsquare - Website Feedback Email', emailContents);

    toastr.info('Thanks! :)');
  }
});

Template.feedbackModalContent.onRendered(function() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      $('.ui.checkbox').checkbox()
    }
  });
});
