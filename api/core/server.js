let Promise = require('bluebird');
Promise.longStackTraces();
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var compression = require('compression');

app.use(bodyParser.json({
	strict: false
}));
app.use(compression());

app.use((req, res, next) => {

	console.log(`[${req.method}] ${req.path}`);
	next();

});

class Server {

	constructor(config) {
		this.port = config.port;
		this.server = null;
	}

	start() {
		return new Promise((resolve) => {
			this.onConfig(app);

			app.use((req, res, next, err) => {
				res.status(500).send(err);
			});

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