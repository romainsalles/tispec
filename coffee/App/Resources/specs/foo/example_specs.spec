# @see https://github.com/pivotal/jasmine/wiki

(() ->
  TispecHelper = require '/lib/tispec/TispecHelper'

  # Awesome function name
  constructABlueWindowWithASquareAndAText = (left) ->
    win = Ti.UI.createWindow(backgroundColor: '#123456')
    win.add(Ti.UI.createView(backgroundColor: '#987654', width: 10, height: 10, top: 60, left: left))
    win.add(Ti.UI.createLabel(text: 'Hi Tispec', top: 90, left: 50))

    return win

  describe '#spec in a folder', () ->
    it 'should return true to be true', () ->
      expect(true).toBe(true)


  describe '#blue window with a square and a text', () ->
    it 'should be positionned perfectly', () ->
      win = constructABlueWindowWithASquareAndAText 30
      win.open()
      TispecHelper.compareScreenshots @id, 'blueWindowWithASquareAndAText_1', () ->
        win.close()

    it 'should be positionned perfectly (2)', () ->
      # this spec is expected to fail
      win = constructABlueWindowWithASquareAndAText 31
      win.open()
      TispecHelper.compareScreenshots @id, 'blueWindowWithASquareAndAText_2', () ->
        win.close()

    it 'should be positionned perfectly (3)', () ->
      TispecHelper.compareScreenshots @id, 'unknown_image' # this spec is expected to fail

    it 'should display the button properly', () ->
      window = Ti.UI.createWindow()
      button = Ti.UI.createButton(title:'Tispec', width:100, height:50)
      window.add(button)
      window.open()
      TispecHelper.compareImages @id, 'TispecButton', button.toImage(null, true), () -> window.close()

)()
