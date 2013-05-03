// Code of your app
// -----------------------------------------------------------------------------
Ti.UI.createTabGroup().addTab(Ti.UI.createTab({
    title:  'MyTab',
    window: Ti.UI.createWindow()
}));

// Code used to launch the specs
// -----------------------------------------------------------------------------
var Connection = require('lib/Connection').Connection,
    connection = new Connection();

connection.bind('localhost', 8128).connect();
