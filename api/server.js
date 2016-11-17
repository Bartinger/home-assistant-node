let BaseServer = require('./core/server');
let socketIo = require('socket.io');
let SocketService = require('./services/socket-service');
let routes = require('./routes');
let viewEngine = require('express-json-views');
let fs = require('fs');
let path = require('path');

class Server extends BaseServer {

	onConfig(app) {
		app.engine('json', viewEngine());
		app.set('views', __dirname + '/views');
		app.set('view engine', 'json');

		let controllersDir = path.join(__dirname, '/controllers');
		let files = fs.readdirSync(controllersDir);
		let controllers = {};
		for (let i = 0; i < files.length; i++) {
			let file = path.join(controllersDir, files[i]);
			let controller = require(file);
			controllers[controller.constructor.name] = controller;
		}
		routes.init(app, controllers);
	}

	onStart(server) {
		this.io = socketIo(server, {});
		this.socketService = new SocketService(this.io);
	}

}

module.exports = new Server({
	port: 3000
});
