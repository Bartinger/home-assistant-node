var Config = require('../../config');
var knex = require('knex')(Config.database);
module.exports = require('bookshelf')(knex);