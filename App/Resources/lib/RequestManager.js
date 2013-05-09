var queue = [];
this.sendRequest = function(actionName, data, onload) {
    queue.push({
      actionName: actionName,
      data:       data,
      onload:     onload
    });
  };

exports.sendRequest = sendRequest ;

function parseResponse(e) {
  if (e.responseText) {
    try { return JSON.parse(e.responseText); }
    catch (err) { Ti.API.error('[RequestManager] error : ' + JSON.stringify(err)); }
  }

  return null;
}

/**
 * Force the order of the requests.
 * Only one request can be sent at the same time, and in the order they are
 * pushed in the stack (FIFO)
 */
(function sendRequests() {
  if (queue[0]) {
    var currentRequest = queue.shift();
    var url = "http://localhost:8666/specs/" + currentRequest.actionName;

    var client = Ti.Network.createHTTPClient({
      onload: function() {
        var e = this;
        if ((e.status === 200 || e.status == 201 || e.status === 422)) {
          if (currentRequest.onload) {
            e.json = parseResponse(e);
            currentRequest.onload(e);
          }

          sendRequests();
        }
      }
    });
    client.open("POST", url);
    client.send(currentRequest.data);
  } else {
    setTimeout(sendRequests, 1000);
  }
})();
