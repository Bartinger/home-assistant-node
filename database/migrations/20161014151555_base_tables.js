
exports.up = function(knex, Promise) {

	return Promise.all([
		knex.schema.createTable('devices', function (table) {
			table.increments().primary();
			table.string('name');
			table.string('device_id');
			table.string('device_unit');
			table.string('origin');
			table.string('protocol');
			table.string('uuid');
			table.timestamps();
		})
	]);

};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTableIfExists('devices')
	]);
};
