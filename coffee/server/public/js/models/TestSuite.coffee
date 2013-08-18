# SubSpec Model
# ----------

# Suite (list of specs)
# In jasmine, it corresponds to the `describe` function.
class tispec.TestSuite extends Backbone.Model
    defaults: () ->
        totalCount: 0
        appName:     '',
        appVersion:  '',
        deviceName:  '',
        deviceModel: ''

    initialize: () ->
        # list of the suites
        @suites = new tispec.SuiteCollection()

    runSpecs: (form) ->
        @suites.reset()
        filter = $(form).find(':input').first().val()
        tispec.SocketManager.get().runSpecs(@id, filter)

        return false

# Collection of TestSuites
# ------------------------
class tispec.TestSuiteCollection extends Backbone.Collection
    model: tispec.TestSuite
