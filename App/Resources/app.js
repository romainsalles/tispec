// Code of your app
// -----------------------------------------------------------------------------
Ti.UI.createTabGroup().addTab(Ti.UI.createTab({
    title:  'MyTab',
    window: Ti.UI.createWindow()
}));

// Connect the app to the tispec server
// -----------------------------------------------------------------------------
require('./lib/tispec/Tispec').initialize('localhost', 8128, 8666);
