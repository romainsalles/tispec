// @see https://github.com/pivotal/jasmine/wiki
(function(){
  var RequestManager = require('/lib/RequestManager');

  function askConfirmation(description) {
    var confirmation = null;

    RequestManager.sendRequest('askConfirmation', {
      expectedBehavior: JSON.stringify({
        description: description
      })
    }, function(e) {
      confirmation = e.json.confirmation;
    });

    waitsFor(function() {
      if (confirmation !== null) {
        expect(confirmation).toEqual(true);
      }

      return confirmation !== null;
    }, "confirmation received", 60000);

    return confirmation;
  }


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
    it('sould ask the user', function() {
      askConfirmation('You should see an unicorn with a black tatoo');
    });
  });
})();
