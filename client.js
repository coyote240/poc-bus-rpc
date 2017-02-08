var http = require('http');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});


var sqs = new AWS.SQS();

var params = {
	QueueUrl: 'https://sqs.us-west-2.amazonaws.com/285138796743/poc-work-queue',
	MessageBody: 'Ping'
};

/*
sqs.sendMessage(params, function (err, data) {
	console.log('Error: ', err);
	console.log('Data: ', data);
});
*/

var server = http.createServer((req, res) => {
	console.log(req);
	res.end();
});
server.listen(8000);
