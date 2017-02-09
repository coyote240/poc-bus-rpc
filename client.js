var http = require('http');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});


var sqs = new AWS.SQS(),
		sns = new AWS.SNS();

function send (msg) {
	var params = {
		QueueUrl: 'https://sqs.us-west-2.amazonaws.com/285138796743/poc-work-queue',
		MessageBody: msg 
	};

	return new Promise((resolve, reject) => {
		sqs.sendMessage(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}


var server = http.createServer((req, res) => {
	send('Ping').then(
		(response) => {
			console.log('Send');
		},
		(error) => {
			console.log('Error: ', error);
		});
	res.end();
});
server.listen(8000);
