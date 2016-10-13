let Promise = require('bluebird');
var express = require('express');
var app = express();

class Server {

	constructor(config) {
		this.port = config.port;
		this.server = null;
	}

	start() {
		return new Promise((resolve) => {
			this.onConfig(app);
			this.server = app.listen(this.port, () => {
				this.onStart(this.server);
				resolve.call(this, this);
			});
		})
	}

	stop() {
		this.onStop(app);
	}

	onConfig(app) {

	}

	onStart(server) {

	}

	onStop() {

	}

	get address() {
		var address = this.server.address();
		var ip = address.address == '::' ? '0.0.0.0' : address.address;
		return 'http://' + ip + ':' + address.port;
	}
}

module.exports = Server;