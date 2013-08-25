class TispecHelper
  RequestManager  = require('/lib/tispec/RequestManager').get()


  @askConfirmation: (specId, description) ->
    confirmation = null;

    RequestManager.sendRequest(
      action: 'askConfirmation',
      onload: (e) -> (confirmation = e.json.valide),
      data:
        specId:           specId,
        expectedBehavior: JSON.stringify description: description
    )

    waitsFor(() ->
      expect(confirmation).toEqual(true) if confirmation isnt null

      return confirmation isnt null;
    , "confirmation received", 60000)

    return confirmation


  @compareImages: (specId, specAlias, image, callback) ->
    confirmation = null

    RequestManager.sendRequest(
      action:  'checkScreenshot',
      headers:
        "enctype":      "multipart/form-data",
        "Content-Type": "image/png"
      ,
      onload: (e) -> (confirmation = e.json.valide),
      data:
        specId:      specId,
        image:       image,
        appName:     Ti.App.name,
        deviceModel: Ti.Platform.model,
        specAlias:   specAlias
    )

    waitsFor(() ->
      if confirmation isnt null
        callback() if callback
        expect(confirmation).toEqual(true)

      return confirmation isnt null
    , "confirmation received", 120000)


  @compareScreenshots: (specId, specAlias, callback) ->
    confirmation = null

    setTimeout(() ->
      Titanium.Media.takeScreenshot (event) ->
        RequestManager.sendRequest(
          action:  'checkScreenshot',
          headers:
            "enctype":      "multipart/form-data",
            "Content-Type": "image/png"
          ,
          onload: (e) -> (confirmation = e.json.valide),
          data:
            specId:      specId,
            image:       event.media,
            appName:     Ti.App.name,
            deviceModel: Ti.Platform.model,
            specAlias:   specAlias
        )
    , 500)

    waitsFor(() ->
      if confirmation isnt null
        callback() if callback
        expect(confirmation).toEqual true

      return confirmation isnt null;
    , "confirmation received", 120000)

module.exports = TispecHelper
