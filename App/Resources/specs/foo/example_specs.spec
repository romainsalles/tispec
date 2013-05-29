// @see https://github.com/pivotal/jasmine/wiki

(function(){
  // Awesome function name
  function constructAndOpenABlueWindowWithASquareAndAText(left) {
    var win = Ti.UI.createWindow({backgroundColor: '#123456'});
    win.add(Ti.UI.createView({backgroundColor: '#987654', width: 10, height: 10, top: 60, left: left}));
    win.add(Ti.UI.createLabel({text: 'Hi Tispec', top: 90, left: 50}));
    win.open();
  }

  describe('#spec in a folder', function() {
    it('should return true to be true', function() {
      expect(true).toBe(true);
    });
  });
  describe('#blue window with a square and a text', function() {
    it('should be positionned perfectly', function() {
      constructAndOpenABlueWindowWithASquareAndAText(30);
      compareScreenshots(this.id, 'blueWindowWithASquareAndAText_1');
    });

    it('should be positionned perfectly (2)', function() {
      // this spec is expected to fail
      constructAndOpenABlueWindowWithASquareAndAText(31);
      compareScreenshots(this.id, 'blueWindowWithASquareAndAText_2');
    });

    it('should be positionned perfectly (3)', function() {
      // this spec is expected to fail
      compareScreenshots(this.id, 'unknown_image');
    });
  });
})();
