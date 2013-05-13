var that = this,
    queue = [];

exports.initialize = function(host, port, specsSuiteId) {
  that.host         = host;
  that.port         = port;
  that.specsSuiteId = specsSuiteId;
};


this.sendRequest = function(config) {
  queue.push(config);
};
exports.sendRequest = sendRequest;


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
    var config = queue.shift();

    var action  = config.action,        // server route
        data    = config.data,          // data sent to the server
        onload  = config.onload,        // callback on request response
        headers = config.headers || []; // request headers

    var url = "http://" + that.host + ":" + that.port +
              "/specs/" + action +
              '?specsSuiteId=' + that.specsSuiteId;

    var client = Ti.Network.createHTTPClient({
      onload: function() {
        var e = this;
        if ((e.status === 200 || e.status == 201 || e.status === 422)) {
          if (onload) {
            e.json = parseResponse(e);
            onload(e);
          }

          sendRequests();
        }
      }
    });
    client.open("POST", url);

    for (var key in headers) { client.setRequestHeader(key, headers[key]); }

    client.send(data);
  } else {
    setTimeout(sendRequests, 200);
  }
})();
