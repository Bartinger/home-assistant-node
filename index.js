var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api/devices', function (req, res) {
	res.send(require('./devices'));
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});