// Broadcast server used to execute specs
// =============================================================================

var BroadcastServer = require('./lib/BroadcastServer').BroadcastServer;

// defined as a global variable
// [TODO] find how we could do differently
broadcastServer = new BroadcastServer(8128);


// Web server
// =============================================================================

var webServer = new require('./server/TispecServer').TispecServer();
