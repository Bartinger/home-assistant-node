class WebError extends Error {

	constructor(code, message, errors) {
		super(message);
		this.code = code;
		this.name = this.constructor.name;
		this.message = message;
		this.errors = errors;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(message)).stack;
		}
	}

	static badRequest(message = 'bad_request') {
		return new WebError(400, message);
	}

	static unauthorized(message = 'unauthorized') {
		return new WebError(401, message);
	}

	static notFound(message = 'not_found') {
		return new WebError(404, message);
	}

	static forbidden(message = 'forbidden') {
		return new WebError(403, message);
	}

	static validationFailed(error) {
		return new WebError(400, 'validation_failed', error);
	}

	static serverError(error) {
		return new WebError(500, 'server_error', error);
	}

	static handle(err, req, res, next) {
		if (err instanceof WebError) {
			return res.status(err.code).render('error', { data: err });
		} else {
			next(err);
		}
	}
}

module.exports = WebError;