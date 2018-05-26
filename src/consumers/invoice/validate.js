"use strict";

var config = require(global.__base + "config.js");

exports.message = function (message, callback) {
	let valid_order_id = false, valid_message_types = false, valid_customer_info = false, valid_template_id = false;

	if (message.order_id) {
		valid_order_id = true;
	}

	if (message.queue && ["order-invoice", "order-email"].indexOf(message.queue) !== -1) {
		valid_message_types = true;
	}

	if (message.customer_info) {
		valid_customer_info = true;
	}

	if (message.template_id) {
		valid_template_id = true
	}

	if (valid_order_id && valid_message_types && valid_customer_info && valid_template_id) {
		callback(null, true);
	} else {
		callback({valid_order_id: valid_order_id, valid_message_types: valid_message_types, valid_customer_info: valid_customer_info, valid_template_id: valid_template_id});
	}
};


