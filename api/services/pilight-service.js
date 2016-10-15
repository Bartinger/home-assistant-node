let spawn = require('child_process').spawn;
let Promise = require('bluebird');
let fs = require('fs');

class PiLightService {

	startDaemon() {
		return runCommand('service', ['pilight', 'start']);
	}

	stopDaemon() {
		return runCommand('service', ['pilight', 'stop']);
	}

	setReceiverEnabled(enabled) {
		let file = __dirname + '/../../config/pilight.json';
		let json = fs.readFileSync(file);
		let config = JSON.parse(json);
		config.hardware['433gpio'].receiver = enabled? 1 : -1;
		json = JSON.stringify(config, null, 2);
		fs.writeFileSync(file, json);
	}

	sendStatus(device, status) {

	}
}

function runCommand(command, args, options) {
	let ps = spawn(command, args, options);
	return new Promise((resolve, reject) => {

		ps.on('close', (code) => {
			resolve(code);
		});

		ps.on('error', (err) => {
			reject(err);
		});

		ps.stdout.on('data', (data) => {
			console.log(`${data}`);
		});

		ps.stderr.on('data', (data) => {
			console.error(`${data}`);
		});

	});
}

module.exports = new PiLightService();