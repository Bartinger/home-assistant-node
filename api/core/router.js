let _ = require('lodash');
let Promise = require('bluebird');
let WebError = require('./error');

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

	patch(path, name, callback) {
		return this.addRoute('patch', path, name, callback);
	}

	delete(path, name, callback) {
		return this.addRoute('delete', path, name, callback);
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
						.catch(WebError, (err) => {
							res.status(err.code);
							res.render('error', {
								data: err
							});
						})
						.catch((err) => {
							handle500(err, res);
						})
				} catch (err) {
					handle500(err, res)
				}
			});
		});
	}
}

function handle500(err, res) {
	console.error(err.stack);
	let webErr = WebError.serverError();
	res.status(webErr.code);
	res.render('error', {
		data: webErr
	});
}

module.exports = Router;