let spawn = require('child_process').spawn;
let Promise = require('bluebird');
let fs = require('fs');

class PiLightService {

	startDaemon() {
		return runCommand('sudo service pilight start');
	}

	stopDaemon() {
		return runCommand('sudo service pilight stop');
	}

	setReceiverEnabled(enabled) {
		let file = __dirname + '/../../config/pilight.json';
		let json = fs.readFileSync();
		let config = JSON.parse(json);
		config.hardware['433gpio'].receiver = enabled? 1 : -1;
		json = JSON.stringify(config);
		fs.writeFileSync(file, json);
	}
}

function runCommand(command) {
	let ps = spawn(command);
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