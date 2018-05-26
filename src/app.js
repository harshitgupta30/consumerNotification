"use strict";

global.__base = __dirname + "/";

var bunyan = require("bunyan");
var child = require('child_process');
var config = require(global.__base + "config.js");
var consumers = config.consumers;

var log = bunyan.createLogger({name: "consumerNotification", vertical: "consumer", level: "info", src: true});

for (let index = 0; index < consumers.length; index++) {
	if (consumers[index].enable) {
		let consumer_path = global.__base + 'consumers/' + consumers[index].name;

		log.info(`Starting ${consumers[index].name} consumer...`);

		child.fork(consumer_path, [JSON.stringify(consumers[index].options || {})]);
	}
}

process.on('uncaughtException', function(err) {
	log.error('Something broke!!! - ' + err.stack);
});
