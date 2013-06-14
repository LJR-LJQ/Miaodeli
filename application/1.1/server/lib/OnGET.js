// [导出]
exports.handleIt = handleIt;
exports.serviceManager = null;

// [模块]
var http = require('http'),
	path = require('path'),
	url = require('url'),
	fs = require('fs'),
	respondFile = require('./lib/respond-file.js').respondFile;

// [变量]
var rootDir = path.resolve(__dirname, '../website/');

// [函数]
function handleIt(req, res) {
	// 处理步骤描述
	// 1、如果客户端请求的是 '/' ，则将用户重定向到 /file-explorer/ ，并不再继续执行后续步骤
	// 2、如果客户端请求的是 '/?serviceId=...&p1=v1&p2=v2...'，则将处理过程转给服务完成，并不再继续执行后续步骤
	// 3、根据客户端请求路径组合出完整的文件绝对路径，如果文件存在，则直接返回文件内容，否则返回 404

	// [变量]
	var serviceManager;

	var rawReqUrl,
		decodedReqUrl,
		parsedReqUrlObj;

	var serviceId;

	var filePathAbs;

	// [流程]
	serviceManager = exports.serviceManager;

	// 解析 URL
	rawReqUrl = req.url;
	decodedReqUrl = decodeURIComponent(rawReqUrl);
	parsedReqUrlObj = url.parse(decodedReqUrl, true);

	// 如果请求的是 '/' 则重定向到 '/file-explorer/index.html'
	// 如果请求的是 '/?...' 则根据解析情况分发给服务处理
	if (parsedReqUrlObj.pathname === '/') {
		if (!parsedReqUrlObj.search) {
			var location = 'http://' + req.headers['host'] + '/file-explorer/index.html';
			res.statusCode = 307;
			res.setHeader('Location', location);
			res.end();
			return;
		} else {
			serviceId = parsedReqUrlObj.query['serviceId'];
			if (!serviceId) {
				res.statusCode = 400;
				res.end();
			} else {
				serviceManager.dispatchUrl(serviceId, req, res);
			}
			
			return;
		}
	}

	// 返回文件内容
	respondFile(rootDir, parsedReqUrlObj, req, res);
}