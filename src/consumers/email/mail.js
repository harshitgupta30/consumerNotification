"use strict";

exports.sendMail = function (message, logger, callback) {
	// Here comes the code to SEND THE EMAIL
	logger.info("************ SUCCESSFULLY SENT THE EMAIL **********");
	callback();
}