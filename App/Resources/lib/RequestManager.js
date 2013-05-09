var queue = [];
this.sendRequest = function(actionName, data) {
    queue.push({
      actionName: actionName,
      data: data
    });
  };

exports.sendRequest = sendRequest ;

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
      onload: sendRequests
    });
    client.open("POST", url);
    client.send(currentRequest.data);
  } else {
    setTimeout(sendRequests, 1000);
  }
})();
