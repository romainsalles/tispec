function askConfirmation(description) {
  var confirmation = null;

  require('/lib/tispec/RequestManager').sendRequest({
    action: 'askConfirmation',
    onload: function(e) { confirmation = e.json.valide; },
    data: {
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

function compareScreenshots(specAlias) {
  var confirmation = null;

  Titanium.Media.takeScreenshot(function(event) {
    require('/lib/tispec/RequestManager').sendRequest({
      action:  'checkScreenshot',
      headers: {
        "enctype":      "multipart/form-data",
        "Content-Type": "image/png"
      },
      onload: function(e) { confirmation = e.json.valide; },
      data: {
        image:       event.media,
        appName:     Ti.App.name,
        deviceModel: Ti.Platform.model,
        specAlias:   specAlias
      }
    });
  });

  waitsFor(function() {
    if (confirmation !== null) {
      expect(confirmation).toEqual(true);
    }

    return confirmation !== null;
  }, "confirmation received", 120000);
}
