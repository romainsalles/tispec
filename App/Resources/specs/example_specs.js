// @see https://github.com/pivotal/jasmine/wiki
(function(){
  describe('example', function() {
    it('should return true to be truthy', function() {
      expect(true).toBeTruthy();
    });

    it('should return 1+1 to be 2', function() {
      expect(1+1).toBe(2);
    });

    it('should return 1+3 to be 4', function() {
      expect(1+3).toBe(4);
      expect(1+3).toBe(4);
      expect(1+4).toBe(4);
      expect(1+4).toBe(4);
    });
  });

})();
