"use strict";

var request = require(global.__base + "io/request.js");
var config = require(global.__base + "config.js");

// This will use the Producer Publish API to send the Email Message
exports.sendMailMessage = function(message, logger, callback) {
	let url = config.end_points.publish.url;
	let method = config.end_points.publish.method;
	let body = {
		order_id: message.order_id,
		type: "order-email",
		customer_info: message.customer_info,
		template_id: 5
	};

	request.make_request({url: url, method: method, body: JSON.stringify(body)}, logger, function (err, response) {
		if (err) {
			logger.error({error: JSON.stringify(err)}, "Failed to publish the message");
		} else {
			logger.info({response: JSON.stringify(response)}, "Successfully publish the message");
		}
		callback(err, response);
	});

}