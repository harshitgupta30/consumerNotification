"use strict";

var kafka = require("kafka-node");
var config = require(global.__base + "config.js");
var HighLevelConsumer = kafka.HighLevelConsumer;

exports.getConsumer = function (consumer_options) {
	let client = new kafka.Client(config.zookeeper_host);

	let consumer = new HighLevelConsumer(client, [{topic: consumer_options.queue}], {groupId: consumer_options.group_id});

	return consumer;
};
