
class View {

	constructor(view, data) {
		this.view = view;
		this.data = data;
	}

	static render(res, view, data) {
		res.render(view, {data:data});
	}
}

module.exports = View;