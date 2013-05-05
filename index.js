// Broadcast server used to execute specs
// =============================================================================

var BroadcastServer = require('./lib/BroadcastServer').BroadcastServer;
var broadcastServer = new BroadcastServer(8128);


// Web server
// =============================================================================

var webServer = new require('./server/TispecServer').TispecServer();
