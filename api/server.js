let BaseServer = require('./core/server');
let socketIo = require('socket.io');
var SocketService = require('./serivce/socket-service');
var routes = require('./routes');

class Server extends BaseServer {

	onStart(server) {
		this.io = socketIo(server, {});
		this.socketService = new SocketService(this.io);
	}

	onConfig(app) {
		routes.init(app);
	}

}

module.exports = new Server({
	port: 3000
});
