let _ = require('lodash');
let Promise = require('bluebird');

class Router {

	constructor() {
		this.routes = {};
	}

	get(path, name, callback) {
		return this.addRoute('get', path, name, callback);
	}

	post(path, name, callback) {
		return this.addRoute('post', path, name, callback);
	}

	addRoute(method, path, name, callback) {
		this.routes[name] = {
			method: method,
			path: path,
			callback: callback
		}
	}

	init(app) {
		_.forOwn(this.routes, (route) => {
			app[route.method].call(app, route.path, (req, res, next) => {

				try {
					var result = route.callback(req, res, next);
					Promise.resolve(result)
						.catch(function(err) {
							console.error(err);
							res.status(500).send(err)
						})
				} catch (err) {
					res.status(500).send(err);
				}



			});
		});
	}

}

module.exports = Router;