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
