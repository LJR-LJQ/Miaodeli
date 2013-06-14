// [导出]
exports.handleIt = handleIt;
exports.serviceManager = null;

// [模块]
var http = require('http'),
	path = require('path'),
	url = require('url'),
	fs = require('fs');

// [常量]
var serviceId_serviceManager = 'ecb30d58-086e-4bf1-b6f7-2b07c2b5a247',
	serviceId_websiteManager = 'a9d7df7e-8bca-4efa-88ad-654a5a989319';

var action_queryDefaultWebsite = 'query default website',
	action_queryWebsite = 'query website',
	action_respond = 'respond';



// [函数]
function handleIt(req, res) {
	var serviceManager;
	serviceManager = exports.serviceManager;

	// 客户端请求的 Content-Type 属于 application/json 类型吗？
	// 是则进行 JSON 解析，然后调用 serviceManager 对象的 dispatch() 方法进行处理
	// 不是则返回 415 错误（Unsupported Media Type）
	if (req.headers['content-type'].toLowerCase() === 'application/json;charset=utf-8') {
		waitJson(req, waitJsonCallback);
	} else {
		res.statusCode = 415;
		res.end();
	}

	// # callback(err, jsonObj)
	function waitJson(req, callback) {
		// [变量]
		var chunks = [],
			totalLength = 0;

		// [流程]
		req.on('data', onData);
		req.on('end', onEnd);

		function onData(chunk) {
			chunks.push(chunk);
			totalLength += chunk.length;
		}

		function onEnd() {
			var buffer,
				str,
				obj;

			try {

				buffer = new Buffer(totalLength);
				for (var i = 0, pos = 0, len = chunks.length; i < len; ++i) {
					var chunk = chunks[i];
					chunk.copy(buffer, pos);
					pos += chunk.length;
				}

				str = buffer.toString('utf8');
				obj = JSON.parse(str);
				callback(null, obj);

			} catch(err) {

				callback(err, null);

			}
		}
	}

	function waitJsonCallback(err, reqObj) {
		// 如果 JSON 解析失败，则返回 400 错误（Bad Request）
		// 如果解析成功，则调用 serviceManager 对象的 dispatch() 方法进行处理
		if (err) {
			res.statusCode = 400;
			res.end();
		} else {
			// 在调用 serviceManager 对象的 dispatch() 方法的过程中
			// 为了增强健壮性，如果出现了预期之外的错误，则返回 500 错误（Internal Server Error）
			try {
				var resObj = serviceManager.dispatch(reqObj, serveItCallback, req, res);
			} catch(err) {
				res.statusCode = 500;
				res.end();
			}
		}

		function serveItCallback(resObj) {
			try {
				var resStr = JSON.stringify(resObj);
				res.setHeader('Content-Type', 'application/json;charset=utf-8');
				res.end(resStr);
			} catch(err) {
				res.statusCode = 500;
				res.end();
			}
		}
	}
}