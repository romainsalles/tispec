function askConfirmation(description) {
  var confirmation = null;

  require('/lib/tispec/RequestManager').sendRequest('askConfirmation', {
    expectedBehavior: JSON.stringify({
      description: description
    })
  }, function(e) {
    confirmation = e.json.valide;
  });

  waitsFor(function() {
    if (confirmation !== null) {
      expect(confirmation).toEqual(true);
    }

    return confirmation !== null;
  }, "confirmation received", 60000);

  return confirmation;
}
