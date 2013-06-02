function askConfirmation(specId, description) {
  var confirmation = null;

  require('/lib/tispec/RequestManager').sendRequest({
    action: 'askConfirmation',
    onload: function(e) { confirmation = e.json.valide; },
    data: {
      specId:           specId,
      expectedBehavior: JSON.stringify({
        description: description
      })
    }
  });

  waitsFor(function() {
    if (confirmation !== null) {
      expect(confirmation).toEqual(true);
    }

    return confirmation !== null;
  }, "confirmation received", 60000);

  return confirmation;
}

function compareImages(specAlias, image, callback) {
  var confirmation = null,
      specId = this.id;

  require('/lib/tispec/RequestManager').sendRequest({
    action:  'checkScreenshot',
    headers: {
      "enctype":      "multipart/form-data",
      "Content-Type": "image/png"
    },
    onload: function(e) { confirmation = e.json.valide; },
    data: {
      specId:      specId,
      image:       image,
      appName:     Ti.App.name,
      deviceModel: Ti.Platform.model,
      specAlias:   specAlias
    }
  });

  waitsFor(function() {
    if (confirmation !== null) {
      if (callback) { callback(); }
      expect(confirmation).toEqual(true);
    }

    return confirmation !== null;
  }, "confirmation received", 120000);
}

function compareScreenshots(specAlias, callback) {
  var confirmation = null,
      specId = this.id;

  setTimeout(function() {
    Titanium.Media.takeScreenshot(function(event) {
      require('/lib/tispec/RequestManager').sendRequest({
        action:  'checkScreenshot',
        headers: {
          "enctype":      "multipart/form-data",
          "Content-Type": "image/png"
        },
        onload: function(e) { confirmation = e.json.valide; },
        data: {
          specId:      specId,
          image:       event.media,
          appName:     Ti.App.name,
          deviceModel: Ti.Platform.model,
          specAlias:   specAlias
        }
      });
    });
  }, 500);

  waitsFor(function() {
    if (confirmation !== null) {
      if (callback) { callback(); }
      expect(confirmation).toEqual(true);
    }

    return confirmation !== null;
  }, "confirmation received", 120000);
}
