// Code of your app
// ----------------------------------------------------------------------------
Ti.UI.createTabGroup().addTab(Ti.UI.createTab({
    title:  'MyTab',
    window: Ti.UI.createWindow()
}));

// Code used to launch the specs
// ----------------------------------------------------------------------------
var specs = ['specs/example_specs.js'];
require('lib/Tispec').start(specs);
