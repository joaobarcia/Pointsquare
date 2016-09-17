Template.conceptCard.helpers({
    hyperlinkIfGodMode: function() {
        var godMode = Session.get("godMode") || false;
        if (godMode) {
          var unitId = this._id;
          return "/concept/" + unitId + "/edit"
        } else {
          return null;
        }
    }
});
