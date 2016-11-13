let BaseServer = require('./core/server');
let socketIo = require('socket.io');
let SocketService = require('./services/socket-service');
let routes = require('./routes');
let viewEngine = require('express-json-views');

class Server extends BaseServer {

	onConfig(app) {
		app.engine('json', viewEngine());
		app.set('views', __dirname + '/views');
		app.set('view engine', 'json');

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
