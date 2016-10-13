let crypto = require("crypto");

class Utils {

	static generateRandomKey(a) {
		var args = Array.prototype.slice.call(arguments);
		args.push(Utils.millis());
		return Utils.generateKey.apply(this, args);
	}

	/**
	 * Generates a static hash based on the given arguments
	 * @param {...*} a -List of arguments to hash
	 * @returns {String} A hash
	 */
	static generateKey(a) {
		var args = Array.prototype.slice.call(arguments);
		var hashStr = args.join('-');
		return crypto.createHash('md5').update(hashStr).digest('hex');
	}

	/**
	 * Returns the current time in milliseconds
	 * @returns {number}
	 */
	static millis () {
		return new Date().getTime();
	}

}

module.exports = Utils;