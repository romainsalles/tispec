# SubSpec Model
# ----------

# Suite (list of specs)
# In jasmine, it corresponds to the `describe` function.
class tispec.TestSuite extends Backbone.Model
    defaults: () ->
        totalCount:  0,
        passedCount: 0,
        errorCount:  0,
        appName:     '',
        appVersion:  '',
        deviceName:  '',
        deviceModel: ''

    initialize: () ->
        # list of the suites
        @suites = new tispec.SuiteCollection()
        @suites.on 'change:passedCount', @updatePassedCount, this
        @suites.on 'change:errorCount' , @updateErrorCount , this

    runSpecs: (form) ->
        @suites.reset()
        filter = $(form).find(':input').first().val()
        tispec.SocketManager.get().runSpecs(@id, filter)

        return false

    updatePassedCount: (suite, newPassedCount) ->
        @set(
            passedCount: @get('passedCount') + newPassedCount,
            totalCount:  @get('totalCount') + newPassedCount
        )

    updateErrorCount: (suite, newErrorCount) ->
        @set(
            errorCount: @get('errorCount') + newErrorCount,
            totalCount: @get('totalCount') + newErrorCount
        )


# Collection of TestSuites
# ------------------------
class tispec.TestSuiteCollection extends Backbone.Collection
    model: tispec.TestSuite
