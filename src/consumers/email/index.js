"use strict";

global.__base = __dirname + '/../../';

var bunyan = require("bunyan");
var async = require("async");
var Queue = require(global.__base + "queue/index.js");
var Validate = require(global.__base + "consumers/email/validate.js");
var SendMail = require(global.__base + "consumers/email/mail.js");

var log = bunyan.createLogger({name: "consumerNotification", vertical: "consumer", level: "info", src: true, consumer: "email"});

var Email = function (options, logger, message) {
	this.options = options;
	this.log = logger;

	try {
		this.message = (typeof message === "string") ? JSON.parse(message) : message;
	} catch (err) {
		logger.error({error: JSON.stringify(err)}, "Failed to parse the messgae");
		this.message = message;
	}
};

Email.prototype.process = function() {
	var self = this;

	async.series(
		[
			function(callback) {
				Validate.message(self.message, function (error, response) {
					if (error) {
						self.log.error({error: JSON.stringify(error)}, "The Message is not valid");
					} else {
						self.log.info({response: response}, "The message is valid");
					}
					callback(error);
				});
			},
			function(callback) {
				SendMail.sendMail(self.message, self.log, function(error, response) {
					if (error) {
						self.log.error({error: JSON.stringify(error)}, "Failed to send the email");
					} else {
						self.log.info({response: JSON.stringify(response)}, "Successfully sent the email");
					}
					callback(error);
				});
			}
		],
		function(err, results) {
			if (err) {
				self.log.error({error: JSON.stringify(err)}, "The message processing has failed");
			} else {
				self.log.info({response: JSON.stringify(results)}, "The message is successfully processed");
			}
		}
	);
};

if(require.main === module) {
	var options = JSON.parse(process.argv[2]);

	var consumer = Queue.getConsumer(options);

	consumer.on("message", function (message) {
		log.info({event_message: JSON.stringify(message)}, "Starting message processing");
		let email = new Email(options, log, message.value);

		try {
			email.process();
		} catch (err2) {
			log.error({error: JSON.stringify(err2)}, "Message execution Failed");
		}
	});

	consumer.on("error", function (error) {
		log.error({error: JSON.stringify(error)}, "Error event thrown by consumer");
	});

	process.on('SIGTERM', function() {
		consumer.close(true, function(){
			process.exit();
		});
	});

	process.on('SIGINT', function() {
		consumer.close(true, function(){
			process.exit();
		});
	});

}