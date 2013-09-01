# @see https://github.com/pivotal/jasmine/wiki

(() ->
  TispecHelper = require '/lib/tispec/TispecHelper'

  isNumber = (o) ->
    ! isNaN (o-0) && o isnt null && o isnt "" && o isnt false && o isnt true

  plusOne = (val) ->
    return null unless isNumber(val)
    return null if     Number.MAX_VALUE - 1 <= val
    val + 1

  describe '#isNumber', () ->
    it 'should return true if number', () ->
      expect(isNumber(Number.MIN_VALUE)).toBe(true)
      expect(isNumber(-10)             ).toBe(true)
      expect(isNumber(0)               ).toBe(true)
      expect(isNumber(10)              ).toBe(true)
      expect(isNumber(Number.MAX_VALUE)).toBe(true)

    it 'should return true if string number', () ->
      expect(isNumber('' + Number.MIN_VALUE)).toBe(true)
      expect(isNumber('' + (-10))           ).toBe(true)
      expect(isNumber('' + 0)               ).toBe(true)
      expect(isNumber('' + 10)              ).toBe(true)
      expect(isNumber('' + Number.MAX_VALUE)).toBe(true)

    it 'should return true if string', () ->
      expect(isNumber('a12')).toBe(false)
      expect(isNumber('12a')).toBe(false)
      expect(isNumber('abc')).toBe(false)
      expect(isNumber('')   ).toBe(false)

    it 'should return false if null', () ->
      expect(isNumber(null)).toBe(false)

    it 'should return false if undefined', () ->
      expect(isNumber(undefined)).toBe(false)

    it 'should return false if boolean', () ->
      expect(isNumber(true) ).toBe(false)
      expect(isNumber(false)).toBe(false)

    it 'should return false if array', () ->
      expect(isNumber([])).toBe(false) # this test will fail

    it 'should return false if object', () ->
      expect(isNumber({})).toBe(false)

    it 'should return false if function', () ->
      expect(isNumber(() -> return 1 )).toBe(false)


  describe '#plusOne', () ->
    it 'should return val + 1', () ->
      expect(plusOne(Number.MIN_VALUE)    ).toBe(Number.MIN_VALUE + 1)
      expect(plusOne(-10)                 ).toBe(-9)
      expect(plusOne(0)                   ).toBe(1)
      expect(plusOne(10)                  ).toBe(11)
      expect(plusOne(Number.MAX_VALUE - 1)).toBe(Number.MAX_VALUE) # this test will fail

    it 'should return null if val is incorrect', () ->
      expect(plusOne(null)            ).toBe(null)
      expect(plusOne(undefined)       ).toBe(null)
      expect(plusOne(Number.MAX_VALUE)).toBe(null)
      expect(plusOne('boum')          ).toBe(null)


  describe '#visual tests', () ->
    it 'should open a yellow window', () ->
      Ti.UI.createWindow(backgroundColor: '#FFFF00').open()
      TispecHelper.askConfirmation this.id, 'You should see a yellow window'

    it 'should open a green window', () ->
      Ti.UI.createWindow(backgroundColor: '#00FF00').open()
      TispecHelper.askConfirmation this.id, 'You should see a green window'

)()
