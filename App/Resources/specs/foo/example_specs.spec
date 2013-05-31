// @see https://github.com/pivotal/jasmine/wiki

(function(){
  // Awesome function name
  function constructABlueWindowWithASquareAndAText(left) {
    var win = Ti.UI.createWindow({backgroundColor: '#123456'});
    win.add(Ti.UI.createView({backgroundColor: '#987654', width: 10, height: 10, top: 60, left: left}));
    win.add(Ti.UI.createLabel({text: 'Hi Tispec', top: 90, left: 50}));

    return win;
  }

  describe('#spec in a folder', function() {
    it('should return true to be true', function() {
      expect(true).toBe(true);
    });
  });
  describe('#blue window with a square and a text', function() {
    it('should be positionned perfectly', function() {
      var win = constructABlueWindowWithASquareAndAText(30);
      win.open();
      compareScreenshots(this.id, 'blueWindowWithASquareAndAText_1', function() {
        win.close();
      });
    });

    it('should be positionned perfectly (2)', function() {
      // this spec is expected to fail
      var win = constructABlueWindowWithASquareAndAText(31);
      win.open();
      compareScreenshots(this.id, 'blueWindowWithASquareAndAText_2', function() {
        win.close();
      });
    });

    it('should be positionned perfectly (3)', function() {
      // this spec is expected to fail
      compareScreenshots(this.id, 'unknown_image');
    });

    it('should display the button properly', function() {
      var window = Ti.UI.createWindow();
      var button = Ti.UI.createButton({title:'Tispec', width:100, height:50});
      window.add(button);
      window.open();
      compareImages(this.id, 'TispecButton', button.toImage(null, true), function() { window.close(); });
    });
  });
})();
