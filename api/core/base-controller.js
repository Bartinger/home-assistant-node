let View = require('./view');
let validator = require('./validator');

class BaseController {

	validate(rules, req) {
		return validator(rules, req.body)
	}

}

module.exports = BaseController;