let View = require('./view');

class BaseController {

	render(res, view, data) {
		return View.render(res, view, data)
	}

}

module.exports = BaseController;