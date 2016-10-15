let BaseServer = require('./core/server');
let socketIo = require('socket.io');
var SocketService = require('./services/socket-service');
var routes = require('./routes');

class Server extends BaseServer {

	onConfig(app) {
		routes.init(app);
	}

	onStart(server) {
		this.io = socketIo(server, {});
		this.socketService = new SocketService(this.io);
	}

}

module.exports = new Server({
	port: 3000
});
