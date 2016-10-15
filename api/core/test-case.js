let _ = require('lodash');
let Config = require('../../config');
let Server = require('../server');
let request = require('supertest');

function createDatabase() {
	var name = Config.database.connection.database;

	var knex = require('knex')({
		client: 'mysql',
		connection: _.pick(Config.database.connection, 'host', 'user', 'password', 'charset')
	});
	return knex.raw('DROP DATABASE IF EXISTS ' + name)
		.then(function () {
			return knex.raw('CREATE DATABASE ' + name);
		})
		.then(function () {
			return knex.destroy();
		})
		.then(function () {
			Config.database.connection.database = name;
			knex = require('knex')(Config.database);
			return knex.migrate.latest()
		})
		.then(function () {
			return knex.seed.run();
		})
}

var server;

class TestCase {

	static setup(context, useServer, useDatabase) {

		if (useServer) {
			TestCase.server = new Server();
			context.beforeEach(function () {
				return createDatabase()
					.then(function () {
						return TestCase.server.start();
					})
			});
			context.afterEach(function () {
				return TestCase.server.stop();
			});
		} else if (useDatabase) {
			context.beforeEach(function () {
				return createDatabase();
			});
		}
	}

	static request() {
		return request(TestCase.server.getInstance());
	}

	static get(path, queryObj) {
		if (queryObj) {
			path += TestCase.serializeQuery(queryObj);
		}
		return TestCase.request().get(path);
	}

	static serializeQuery(obj) {
		return '?' + Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
	}

	static post(path, data) {
		return TestCase.request().post(path).send(data);
	}

	static form(path, data, files) {
		var req = TestCase.request().post(path);
		if (data) {
			_.forOwn(data, (val, key) => {
				req.field(key, val);
			});
		}
		if (files) {
			if (_.isString(files)) {
				req.attach('file', files);
			} else {
				_.forOwn(files, (val, key) => {
					req.attach(key, val);
				});
			}
		}
		return req;
	}

	static patch(path, data) {
		return TestCase.request().patch(path).send(data);
	}

	static delete(path) {
		return TestCase.request().delete(path);
	}

	static send(req, auth) {
		if (auth) {

			var authReq = TestCase.post('/auth', {
				email: Config.app.test.email,
				password: Config.app.test.password
			}).expect(200);
			return sendRequest(authReq)
				.then(function (res) {
					var cookie = res.header['set-cookie'][0];
					req.set('cookie' , cookie);
					return sendRequest(req);
				});
		}
		return sendRequest(req);
	}
}

function sendRequest(req) {
	return new Promise(function (resolve, reject) {
		req.end(function (err, res) {
			if (err) {
				reject(err);
			} else {
				if (res.ok) {
					resolve(res);
				} else {
					reject(res);
				}
			}
		})
	});
}

module.exports = TestCase;