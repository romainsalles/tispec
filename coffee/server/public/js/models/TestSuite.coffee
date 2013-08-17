# SubSpec Model
# ----------

# Suite (list of specs)
# In jasmine, it corresponds to the `describe` function.
class tispec.TestSuite extends Backbone.Model
    defaults: () ->
        totalCount: 0
    initialize: () ->
        # list of the suites
        @suites = new tispec.SuiteCollection();
    setSocket: (socket) ->
        @_socket = socket
    runSpecs: (form) ->
        filter = $(form).find(':input').first().val()
        @_socket.emit 'runSpecs', specsSuiteId: this.id, filter: filter

        false

# Collection of TestSuites
# ------------------------
class tispec.TestSuiteCollection extends Backbone.Collection
    model: tispec.TestSuite
