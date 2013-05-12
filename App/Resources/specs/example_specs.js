// @see https://github.com/pivotal/jasmine/wiki

(function(){
  function isNumber(o) {
    return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
  }

  function plusOne(val) {
    if (!isNumber(val)) { return null; }
    if (Number.MAX_VALUE - 1 <= val) { return null; }

    return val + 1;
  }

  describe('#isNumber', function() {
    it('should return true if number', function() {
      expect(isNumber(Number.MIN_VALUE)).toBe(true);
      expect(isNumber(-10)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(10)).toBe(true);
      expect(isNumber(Number.MAX_VALUE)).toBe(true);
    });
    it('should return true if string number', function() {
      expect(isNumber('' + Number.MIN_VALUE)).toBe(true);
      expect(isNumber('' + (-10))).toBe(true);
      expect(isNumber('' + 0)).toBe(true);
      expect(isNumber('' + 10)).toBe(true);
      expect(isNumber('' + Number.MAX_VALUE)).toBe(true);
    });
    it('should return true if string', function() {
      expect(isNumber('a12')).toBe(false);
      expect(isNumber('12a')).toBe(false);
      expect(isNumber('abc')).toBe(false);
      expect(isNumber('')).toBe(false);
    });
    it('should return false if null', function() {
      expect(isNumber(null)).toBe(false);
    });
    it('should return false if undefined', function() {
      expect(isNumber(undefined)).toBe(false);
    });
    it('should return false if boolean', function() {
      expect(isNumber(true)).toBe(false);
      expect(isNumber(false)).toBe(false);
    });
    it('should return false if array', function() {
      // this test will fail
      expect(isNumber([])).toBe(false);
    });
    it('should return false if object', function() {
      expect(isNumber({})).toBe(false);
    });
    it('should return false if function', function() {
      expect(isNumber(function() { return 1; })).toBe(false);
    });
  });

  describe('#plusOne', function() {
    it('should return val + 1', function() {
      expect(plusOne(Number.MIN_VALUE)).toBe(Number.MIN_VALUE + 1);
      expect(plusOne(-10)).toBe(-9);
      expect(plusOne(0)).toBe(1);
      expect(plusOne(10)).toBe(11);
      // this test will fail
      expect(plusOne(Number.MAX_VALUE - 1)).toBe(Number.MAX_VALUE);
    });

    it('should return null if val is incorrect', function() {
      expect(plusOne(null)).toBe(null);
      expect(plusOne(undefined)).toBe(null);
      expect(plusOne(Number.MAX_VALUE)).toBe(null);
      expect(plusOne('boum')).toBe(null);
    });
  });

  describe('#visual tests', function() {
    it('should open a yellow window', function() {
      Ti.UI.createWindow({backgroundColor: '#FFFF00'}).open();
      askConfirmation('You should see a yellow window');
    });
    it('should open a green window', function() {
      Ti.UI.createWindow({backgroundColor: '#00FF00'}).open();
      askConfirmation('You should see a green window');
    });
  });
})();
