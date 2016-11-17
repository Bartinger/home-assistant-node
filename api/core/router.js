let path = require('path');
let Promise = require('bluebird');
let WebError = require('./error');

class Router {

	constructor(path) {
		this.basePath = path || '';
		this.routes = [];
		this.nodes = [];
	}

	get(endpoint, func) {
		this.addRoute('GET', endpoint, func);
	}

	post(endpoint, func) {
		this.addRoute('POST', endpoint, func);
	}

	put(endpoint, func) {
		this.addRoute('PUT', endpoint, func);
	}

	patch(endpoint, func) {
		this.addRoute('PATCH', endpoint, func);
	}

	destroy(endpoint, func) {
		this.addRoute('DELETE', endpoint, func);
	}

	group(endpoint, callback) {
		let router = new Router(this.getPath(endpoint));
		callback.apply(router);
		this.nodes.push(router);
	}

	crud(endpoint, controller, callback) {
		this.group(endpoint, function () {

			this.get('', controller + '.find');
			this.get('/:id', controller + '.findOne');
			this.post('', controller + '.create');
			this.patch('/:id', controller + '.update');
			this.destroy('/:id', controller + '.destroy');

			if (callback) {
				callback.apply(this);
			}
		});
	}

	getPath(endpoint) {
		return path.join(this.basePath, endpoint);
	}

	addRoute(method, endpoint, func) {
		this.routes.push({
			method: method,
			endpoint: endpoint,
			callback: func
		});
	}

	init(app, controllers) {
		let router = this;
		this.routes.forEach(function (route) {

			let method = route.method.toLowerCase();
			let endpoint = router.getPath(route.endpoint);

			//console.log('[%s] %s', route.method, endpoint);

			app[method].call(app, endpoint, (req, res, next) => {

				new Promise((resolve, reject) => {

					try {
						let result = getBoundControllerFunction(route.callback, controllers)(req, res, next);
						resolve(result);
					} catch (err) {
						reject(err);
					}
				})
					.catch(WebError, (err) => {
						res.status(err.code).render('error', {data: err});
					})
					.catch((err) => {
						console.error(err);
						res.status(500).render('error', {
							data: new WebError.WebError(500, 'internal_server_error', 'fuck')
						})
					});
			});
		});

		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].init(app, controllers);
		}
	}

	print() {
		for (let i = 0; i < this.routes.length; i++) {
			let route = this.routes[i];

			console.log('[%s] %s => %s', route.method, this.getPath(route.endpoint), route.callback);
		}

		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].print();
		}
	}

}

function getBoundControllerFunction(callback, controllers) {
	let args = callback.split('.');
	if (args.length != 2) {
		throw new Error('Malformed controller function ' + callback + ' should look like Controller.function');
	}
	let controller = controllers[args[0]];
	let func = controller[args[1]];

	if (!controller) {
		throw new Error(`Controller (${args[0]}) not found`);
	}

	if (!func) {
		throw new Error(`Function (${args[1]} not found in ${args[0]}`);
	}

	return func.bind(controller);
}

module.exports = Router;
