let _ = require('lodash');

class Router {

	constructor() {
		this.routes = {};
	}

	get(path, name, ...functions) {
		return this.addRoute('get', path, name, functions);
	}

	post(path, name, ...functions) {
		return this.addRoute('post', path, name, functions);
	}

	addRoute(method, path, name, ...functions) {
		this.routes[name] = {
			method: method,
			path: path,
			functions: functions
		}
	}

	init(app) {
		_.forOwn(this.routes, (route) => {
			app[route.method].call(app, route.path, route.functions);
		});
	}

}

module.exports = Router;