var Bookshelf = require("../core/bookshelf");

module.exports = Bookshelf.Model.extend({
	tableName: 'devices',
	hasTimestamps: true
});