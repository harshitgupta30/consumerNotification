"use strict";

var request = require("request");
var qs = require("querystring");

exports.make_request = function(data, log, callback) {
	var request_body = {url: data.url, method: data.method};

	if(!log) {
		log = console;
	}

	request_body.headers = data.headers || {"Content-Type": "application/json"};

	request_body.encoding = null;
	if(data.querystring) {
		request_body.qs = data.querystring;
		request_body.url=request_body.url+"?"+qs.stringify(request_body.qs);
		delete request_body.qs;
	}
	if(data.body) {
		request_body.body = data.body;
	}
	if(data.timeout) {
		request_body.timeout = data.timeout;
	}
	if(data.form) {
		request_body.form = data.form;
	}

	if(data.logit) {
		log.info({request: JSON.stringify(request_body)}, "Initiating a new request");
	}
	request(request_body, function(err, response, body) {
		var parse_error;

		try {
			if(body && data.replacer) {
				body = body.replace(data.replacer.from, data.replacer.to);
			}
			body = JSON.parse((body || "{}"));
		} catch(error) {
			body = body.toString();
			parse_error = error;
		}

		if(err || parse_error || !body || body.error || body.errorMessage || (body.data && body.data.Error)) {
			body = body || {error: "could not determine"};
			log.error({request_body: JSON.stringify(request_body), body: JSON.stringify(body), error: JSON.stringify(err || parse_error || body.error || body.errorMessage || (body.data? body.data.Error : ""))}, "IO Request made has an error");
			callback((err || parse_error || body.error || body.errorMessage || (body.data? body.data.Error : "")), body);
		} else {
			log.info({request_body: JSON.stringify(request_body), body: JSON.stringify(body)}, "Request made is successful");
			callback(null, body);
		}
	});
};