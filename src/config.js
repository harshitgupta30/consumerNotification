"use strict";

module.exports = {
	consumers: [{
			enable: true,
			name: "invoice",
			options: {
				queue: "order-invoice",
				group_id: "order-invoice"
			}
		},{
			enable: true,
			name: "email",
			options: {
				queue: "order-email",
				group_id: "order-email"
			}
		}
	],
	zookeeper_host: "localhost:2181",
	kafka_host: "localhost:9092",
	end_points: {
		publish: {
			url: "http://localhost:4000/publish/message",
			method: "POST"
		}
	}
}