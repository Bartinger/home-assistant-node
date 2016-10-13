let BaseServer = require('./core/server');
let socketIo = require('socket.io');
var SocketService = require('./serivce/socket-service');

class Server extends BaseServer {

	onStart(app) {
		this.io = socketIo(app, {});
		this.socketService = new SocketService(this.io);
	}

	onConfig(app) {
		app.get('/', (req, res) => {
			res.send('works');
		});
	}

}

module.exports = new Server({
	port: 3000
});
