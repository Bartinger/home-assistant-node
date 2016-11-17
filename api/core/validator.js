let Checkit = require('checkit');
let Errors = require('./error');
let _ = require("lodash");
let Promise = require("bluebird");

/**
 * Validates a given data set against the rules
 * @param rules
 * @param data
 * @returns {Promise}
 * @return {Promise}
 */
function validate(rules, data) {

	let subRules = _.pickBy(rules, _.isPlainObject);
	rules = _.omitBy(rules, _.isPlainObject);

	let validatedObject = {};
	let subErrors = {};
	let hasSubError = false;
	_.forOwn(subRules, function (val, key) {
		if (val._self) {
			rules[key] = val._self;
			val = _.omit(val, '_self');
		}
		for (let i = 0; i < data[key].length; i++) {
			let result = new Checkit(val).runSync(data[key][i]);
			validatedObject[key] = validatedObject[key] || [];
			subErrors[key] = subErrors[key] || [];
			if (result[0]) {
				let err = createError(result[0]);
				hasSubError = true;
				subErrors[key].push(err);
			} else {
				validatedObject[key].push(result[1]);
				subErrors[key].push({});
			}

		}
	});

	let checkit = new Checkit(rules);
	let result = checkit.runSync(data);

	let error;
	if (result[0]) {
		error = createError(result[0]);
	}
	if (hasSubError) {
		error = error || {};
		_.defaults(error, subErrors);
	}

	if (error) {
		error = Errors.validationFailed(error);
	} else {
		_.defaults(validatedObject, result[1]);
	}

	return new Promise(function (resolve, reject) {

		if (error) {
			reject(error);
		} else {
			resolve(validatedObject);
		}

	});
}

function createError(err) {
	let stack = {};
	err.each(function (fieldError) {
		stack[fieldError.key] = [];
		fieldError.each(function (singleErr) {
			stack[fieldError.key].push(Errors.getEnum(singleErr.rule))
		});
	});
	return stack;
}

/**
 * @exports {validate}
 */

module.exports = validate;


