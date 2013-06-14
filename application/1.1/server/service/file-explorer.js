// [导出]
exports.name = 'File Explorer';
exports.serviceId = 'deecaaae-aa92-48f4-932c-0ce52025c224';
exports.serveIt = serveIt;
exports.requestOtherService = requestOtherService;
exports.responseUrl = responseUrl;

// [模块]
var fs = require('fs'),
	url = require('url'),
	path = require('path'),
	getLogicalDrives = require('./lib/get-logical-drives.js').getLogicalDrives,
	enumFiles = require('./lib/enum-files.js').enumFiles;

// [变量]
var actionMap = {};

// [流程]
actionMap['query dir'] = onQueryDir;

// [函数]
function serveIt(req, callback) {
	var handler;

	handler = actionMap[req.action];
	if (handler) {
		handler(req, callback);
	} else {
		safeCall(callback, {error: 'unknown action'});
	}
}

function responseUrl(_rawReq, _rawRes) {
	// 注意 url.parse 的同时也做了 decodeURI
	var filePath = url.parse(_rawReq.url, true).query['filePath'];
	//console.log(filePath);

	var fileName = path.basename(filePath);
	fileName = encodeURIComponent(fileName);
	//console.log(fileName);
	_rawRes.setHeader('Content-Type', 'application/octet-stream');
	_rawRes.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

	fs.lstat(filePath, function(err, stats) {
		if (err) {
			_rawRes.statusCode = 404;
			_rawRes.end();
			return;
		}

		_rawRes.setHeader('Content-Length', stats.size);
		console.log('file size: ' + stats.size);

		// 发送
		var readStream = fs.createReadStream(filePath);
		readStream.pipe(_rawRes);
	})

}

function requestOtherService(req, callback) {
	safeCall(callback, {error: 'service not found'});
}

function _onQueryDir(req, callback) {
	var dirPath,
		resObj;

	dirPath = req.dirPath;

	if (dirPath === '/') {
		resObj = {
			parentDirList: [
				pathItem('/', '/')
			],
			subDirList: [
				pathItem('dir 1', '/dir 1'),
				pathItem('dir 2', '/dir 2')
			],
			fileList: [
				pathItem('file 1', '/dir 1/file 1'),
				pathItem('file 2', '/dir 1/file 2'),
				pathItem('file 3', '/dir 1/file 3')
			]
		};

		callback(resObj);
	} else if (dirPath === '/dir 1') {
		resObj = {
			parentDirList: [
				pathItem('/', '/'),
				pathItem('dir 1', '/dir 1'),
			],
			subDirList: [
				pathItem('dir 1-1', '/dir 1/dir 1-1'),
				pathItem('dir 1-2', '/dir 1/dir 1-2')
			],
			fileList: [
				pathItem('file 1-1', '/dir 1/file 1'),
				pathItem('file 1-2', '/dir 1/file 2'),
				pathItem('file 1-3', '/dir 1/file 3')
			]
		};

		callback(resObj);
	} else if (dirPath === '/dir 2') {
		resObj = {
			parentDirList: [
				pathItem('/', '/'),
				pathItem('dir 2', '/dir 2'),
			],
			subDirList: [
				pathItem('dir 2-1', '/dir 2/dir 2-1'),
				pathItem('dir 2-2', '/dir 2/dir 2-2'),
				pathItem('dir 2-3', '/dir 2/dir 2-3')
			],
			fileList: [
				pathItem('file 2-1', '/dir 2/file 2-1'),
			]
		};

		callback(resObj);
	} else {
		callback({error: 'wrong path'});
	}
}

function onQueryDir(req, callback) {
	// 目前是针对 Windows 系统设计的
	var dirPath,
		resObj;

	dirPath = req.dirPath;
	console.log('query dir: ' + dirPath);

	resObj = {
		parentDirList: [],
		subDirList: [],
		fileList: []
	};
	if (dirPath === '') {
		getLogicalDrives(function(drives) {
			resObj.parentDirList.push(pathItem('计算机', ''));
			drives.forEach(function(d) {
				resObj.subDirList.push(pathItem(d + ':', d + ':\\'));
			});

			callback(resObj);
		});
	} else {
		dirPath = path.resolve(dirPath);
		inspectDirPath(dirPath, function(struct) {
			resObj = struct;
			callback(resObj);
		});
	}
}


function inspectDirPath(dirPath, scb) {
	var struct = {
		parentDirList: [],
		subDirList: [],
		fileList: []
	};

	dirPath = path.resolve(dirPath);

	// 构造好父目录结构
	calcParentDirList(dirPath, function(parentDirList) {
		parentDirList.unshift(pathItem('计算机', ''));
		struct.parentDirList = parentDirList;

		// 构造子目录结构和文件结构
		enumFiles(dirPath, function(o) {
			// 获取成功，要对其格式进行转换
			// 首先转换目录
			o.directories.forEach(function(subdir) {
				var fullpath = path.resolve(dirPath, subdir.name);
				struct.subDirList.push(pathItem(subdir.name, fullpath, subdir.hidden));
			});

			o.files.forEach(function(file) {
				var fullpath = path.resolve(dirPath, file.name);
				struct.fileList.push(pathItem(file.name, fullpath, file.hidden));
			});

			if (scb) {
				scb(struct);
			}

		}, function() {
			// 不明原因导致获取目录及文件失败
			// 但是还是要响应客户端的请求
			// 当作没有子目录和文件
			if (scb) {
				scb(struct);
			}
		});

		// fs.readdir(dirPath, function(err, list) {
		// 	if (err) {
		// 		console.log(err.toString());
		// 		return;
		// 	}
		// 	list.forEach(function(item) {
		// 		var fullpath = path.resolve(dirPath, item),
		// 			s;
		// 		try {
		// 			s = fs.lstatSync(fullpath);
		// 			if (s.isFile()) {
		// 				struct.fileList.push(pathItem(item, fullpath));
		// 			} else if (s.isDirectory()) {
		// 				struct.subDirList.push(pathItem(item, fullpath));
		// 			}
		// 		} catch(err) {
		// 			console.log(err.toString());
		// 		}
		// 	});


		// 	if (scb) {
		// 		scb(struct);
		// 	}

		// });
	});
}

// # scb(list)
// list: [item,...]
// item: {name:'', path:''}
function calcParentDirList(dirPath, scb) {
	if (typeof dirPath !== 'string' || dirPath.length < 0) {
		return;
	}

	if (dirPath[dirPath.length-1] !== path.sep) {
		dirPath = dirPath + path.sep;
	}

	var list = [];

	while (true) {
		var o = lastPartOfIt(dirPath);
		if (o.part || o.rest) {
			list.unshift(pathItem(o.part, dirPath));
			dirPath = o.rest;
		} else {
			break;
		}
	}

	if (scb) {
		scb(list);
	}

	function lastPartOfIt(dirPath) {
		if (dirPath[dirPath.length-1] !== path.sep) {
			dirPath = dirPath + path.sep;
		}

		for (var i = dirPath.length-2; i >= 0 && dirPath[i] !== path.sep; --i) {
		}
		var o = {
			part: dirPath.substring(i+1, dirPath.length-1),
			rest: dirPath.substring(0, i+1)
		};
		return o;
	}
}

function calcSubDirListAndFileList(dirPath, scb) {
	
}

function pathItem(name, path, hidden) {
	var o = {
		name: name,
		path: path
	};
	if (hidden) {
		o.hidden = hidden;
	}
	return o;
}