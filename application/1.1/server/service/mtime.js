// [导出]
exports.name = 'mtime';
exports.serviceId = 'b0ae2e86-a1b6-4e9d-a245-0173e6e8b857';
exports.serveIt = serveIt;
exports.requestOtherService = requestOtherService;
exports.initialize = initialize;

// [模块]
var fs = require('fs'),
	path = require('path');

// [变量]
var actionMap = {},
	rootDir = path.resolve(__dirname, '../website/');

// [流程]
actionMap['retrive mtime'] = onRetriveMtime;

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
function onRetriveMtime(req, callback) {
	var decodedPathList,
		filePathAbs,
		mtime,
		mtimeList;

	decodedPathList = req.pathList;
	// 检查格式
	// todo

	mtimeList = [];

	decodedPathList.forEach(function(decodedPath) {
		try {
			filePathAbs = path.join(rootDir, decodedPath);
			mtime = fs.statSync(filePathAbs).mtime;
			mtimeList.push({
				path: decodedPath,
				mtime: mtime
			});
		} catch(err) {
			console.log('mtime error: ' + err.toString());
		}
	});


	safeCall(callback, {mtimeList: mtimeList});
}