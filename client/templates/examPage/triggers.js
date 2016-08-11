Template.examPage.rendered = function() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            $('.tooltipped').tooltip({
                delay: 20
            });
            $('.modal-trigger').leanModal();
        }
    });
};
