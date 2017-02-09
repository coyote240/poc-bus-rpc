var timers = require('timers');

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var sqs = new AWS.SQS(),
		sns = new AWS.SNS();

function receive () {

	var params = {
		MaxNumberOfMessages: 5,
		QueueUrl: 'https://sqs.us-west-2.amazonaws.com/285138796743/poc-work-queue'
	};

	return new Promise(function (resolve, reject) {

		sqs.receiveMessage(params, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});

	});
}

function deleteMessage (receipt) {

	var params = {
		ReceiptHandle: receipt,
		QueueUrl: 'https://sqs.us-west-2.amazonaws.com/285138796743/poc-work-queue'
	};

	return new Promise(function (resolve, reject) {

		sqs.deleteMessage(params, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});

	});

}

function respond (msg) {
	var params = {
		Message: 'Pong',
		TopicArn: 'arn:aws:sns:us-west-2:285138796743:poc-service-response'
	};

	return new Promise((resolve, reject) => {

		sns.publish(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});

	});
}

timers.setInterval(function () {
	receive().then(
			(data) => {
				if (!data.Messages) {
					return;
				}

				var msg = data.Messages.shift();
				console.log('Message: ', msg);

				respond(msg).then(
					(response) => {
						console.log('Response success: ', response);
					},
					(error) => {
						console.log('Response error: ', error);
					});


				deleteMessage(msg.ReceiptHandle).then(
					(response) => {
						console.log('Delete success: ', response);
					},
					(error) => {
						console.log('Delete Error: ', error);
					});
			},
			(error) => {
				console.log('Receive Error: ', error);
			});
}, 1000);
