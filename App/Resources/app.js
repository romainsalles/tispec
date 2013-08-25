// Code of your app
// -----------------------------------------------------------------------------
Ti.UI.createTabGroup().addTab(Ti.UI.createTab({
    title:  'MyTab',
    window: Ti.UI.createWindow()
}));

// Connect the app to the tispec server
// -----------------------------------------------------------------------------
var Tispec = require('./lib/tispec/Tispec'),
    tispec = Tispec.get('localhost', 8128, 8666);
