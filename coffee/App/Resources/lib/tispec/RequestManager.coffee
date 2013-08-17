class RequestManager
  instance = null
  # Static method used to either retrieve the
  # instance or create a new one.
  @get: (host, port, specsSuiteId) -> instance ?= new PrivateRequestManager host, port, specsSuiteId


# Create a private class that we can initialize however
# defined inside the wrapper scope.
class PrivateRequestManager
  constructor: (@host, @port, @specsSuiteId) ->
    @queue = []
    @_sendRequests()

  sendRequest: (config) ->
    @queue.push(config)

  _parseResponse: (e) ->
    if e.responseText
      try
        return JSON.parse e.responseText
      catch err
        Ti.API.error "[RequestManager] error : #{JSON.stringify(err)}"

    return null

  # Force the order of the requests.
  # Only one request can be sent at the same time, and in the order they are
  # pushed in the stack (FIFO)
  _sendRequests: () =>
    self = this

    if @queue[0]
      config = @queue.shift()

      action  = config.action         # server route
      data    = config.data           # data sent to the server
      onload  = config.onload         # callback on request response
      headers = config.headers || []  # request headers

      url = "http://#{@host}:#{@port}/specs/#{action}?specsSuiteId=#{@specsSuiteId}"

      client = Ti.Network.createHTTPClient(
        onload: () ->
          e = this
          if e.status in [200, 201, 422]
            if onload
              e.json = @_parseResponse e
              onload e

            self._sendRequests()
      )
      client.open 'POST', url

      for key in headers
        client.setRequestHeader key, headers[key]

      client.send data
    else
      setTimeout @_sendRequests, 200

module.exports = RequestManager
