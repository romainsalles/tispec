# Broadcast server used to execute specs
# =============================================================================

BroadcastServer = (require './lib/BroadcastServer').BroadcastServer;

# defined as a global variable
# [TODO] find how we could do differently
global.broadcastServer = new BroadcastServer 8128


# Web server
# =============================================================================

TispecServer = (require './server/TispecServer').TispecServer
webServer = new TispecServer()
