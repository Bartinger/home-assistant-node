
let server = require('./api/server');
server.start()
	.then((server) => {
		console.log('Server running on', server.address);
	});