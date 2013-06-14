// [导出]
exports.name = 'Service Manager';
exports.serviceId = 'ecb30d58-086e-4bf1-b6f7-2b07c2b5a247';
exports.serveIt = serveIt;
exports.dispatch = dispatch;
exports.dispatchUrl = dispatchUrl;

// [模块]
var fs = require('fs'),
	path = require('path');

// [变量]
var serviceList = [];

// [流程]
loadServices();

// [函数]
function serveIt(req, callback) {
	safeCall(callback, {error: 'unknown action'});
}

function dispatch(req, callback, _rawReq, _rawRes) {
	var service;
	console.log(req.action);
	// TODO 对 req 进行一些验证
	service = serviceList[req.serviceId];
	if (service) {
		try {
			service.serveIt(req, callbackProxy, _rawReq, _rawRes);
		} catch(err) {
			safeCall(callback, {error: 'service internal error'});
		}
	} else {
		safeCall(callback, {error: 'unknown service id'});
	}

	function callbackProxy(resObj) {
		// 响应时也要带上服务编号
		if (typeof resObj === 'object') {
			resObj.serviceId = service.serviceId;
		}

		safeCall(callback, resObj);
	}
}

function dispatchUrl(serviceId, _rawReq, _rawRes) {
	var service;

	service = serviceList[serviceId];
	if (service) {
		try {
			service.responseUrl(_rawReq, _rawRes);
		} catch(err) {
			_rawRes.end();
		}
	} else {
		// 如果服务找不到，就直接返回 400 错误
		_rawRes.statusCode = 400;
		_rawRes.end();
	}
}

function loadServices() {
	var files,
		obj;

	// 读取文件列表
	files = fs.readdirSync(path.resolve(__dirname, '../service/'));

	// 转换为绝对路径
	files = files.map(function(file) {
		return path.resolve(__dirname, '../service/', file);
	});

	// 逐个加载
	files.forEach(function(file) {
		try {
			if (!isJsFile(file)) return;
			obj = require(file);
			// TODO 对 obj 进行一些验证
			serviceList.push(obj);
			serviceList[obj.serviceId] = obj;
			obj.requestOtherService = requestOtherServiceImp;
		} catch(err) {
			console.log('load service failed: ' + file);
			console.error(err.toString());
		}
	});

	// 逐个初始化
	serviceList.forEach(function(service) {
		if (service.initialize) {
			try {
				service.initialize();
			} catch(err) {
				console.log('initialize failed: ' + service.name);
				console.log(err.toString());
			}
		}
	})

	function isJsFile(filename) {
		var ext = path.extname(filename);
		if (typeof ext === 'string') {
			return ext.toLowerCase() === '.js';
		} else {
			return false;
		}
	}
}

function safeCall(callback, resObj) {
	if (typeof callback !== 'function') return;
	try {
		callback(resObj);
	} catch(err) {

	}
}

function requestOtherServiceImp(req, callback) {
	dispatch(req, callback);
}