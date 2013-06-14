// [导出]
exports.name = 'Ketchup Language';
exports.serviceId = 'ba12d37a-cef7-4d8d-bf8d-15613c61dafa';
exports.serveIt = serveIt;
exports.requestOtherService = requestOtherService;
exports.initialize = initialize;

// [模块]
var fs = require('fs'),
	path = require('path'),
	compile = require('./lib/ketchup.js').compile;

// [变量]
var actionMap = {};

// [流程]
actionMap['compile'] = onCompile;

// [函数]
function initialize() {
}

function serveIt(req, callback) {
	var handler;

	handler = actionMap[req.action];
	if (handler) {
		handler(req, callback);
	} else {
		safeCall(callback, {error: 'unknown action'});
	}
}

function safeCall(callback, resObj) {
	if (typeof callback !== 'function') return;
	try {
		callback(resObj);
	} catch(err) {

	}
}

function requestOtherService(req, callback) {
	safeCall(callback, {error: 'service not found'});
	
}

// [用户请求处理]
function onCompile(req, callback) {
	var inputFile,
		outputFile;

	inputFile = req.inputFile;
	outputFile = req.outputFile;

	if (compile(inputFile, outputFile)) {
		safeCall(callback, {});
	} else {
		safeCall(callback, {error: 'compile failed'});
	}
}