
exports.up = function(knex, Promise) {

	return Promise.all([
		knex.schema.createTable('devices', function (table) {
			table.increments().primary();
			table.string('name');
			table.string('device_id');
			table.string('unit');
			table.string('protocol');
			table.timestamps();
		})
	]);

};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTableIfExists('devices')
	]);
};
