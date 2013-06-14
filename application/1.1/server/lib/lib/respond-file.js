// [导出]
exports.respondFile = respondFile;

// [模块]
var mime = require('./mime.js').mime,
	fs = require('fs'),
	path = require('path');

// [函数]
function respondFile(rootDir, parsedReqUrlObj, req, res) {
	// 拼接出实际的路径
	fs.realpath(path.join(rootDir, parsedReqUrlObj.pathname), realPathCallback);

	function realPathCallback(err, resolvedPath) {
		if (err) {
			res.statusCode = 404;
			res.end();
			return;
		}

		// 还需要判断路径必须带有 rootDir 作为前缀，防止向前越界访问
		// TODO

		// 目标必须是文件，如果不是，则返回 404
		fs.lstat(resolvedPath, lstatCallback);

		function lstatCallback(err, stats) {
			if (err || !stats.isFile()) {
				res.statusCode = 404;
				res.end();
				return;
			}

			// 至此检查完毕，开始返回文件内容
			doRespond(resolvedPath);
		}
	}

	function doRespond(filepath) {
		// 设置 MIME
		res.setHeader('Content-Type', mime(filepath));
		// 目前尚不能支持 Range 特性
		if (req.headers['range'] && false) {
			console.log('range request');
			res.statusCode = 206;
			res.setHeader('Content-Range', 'bytes 0-23014356/23014356');
		}
		//res.setHeader('Accept-Ranges', 'none');
		// 设置缓存超时为 1 天
		var expiresDate = new Date();
		expiresDate.setDate(expiresDate.getDate() + 1);
		res.setHeader('Expires', expiresDate.toUTCString());

		// 读取并返回文件内容
		var stream = fs.createReadStream(filepath);
		stream.once('data', onData);
		stream.once('close', onClose);
		stream.once('error', onError);

		function onData(data) {
			res.write(data);
			stream.pipe(res);
		}

		function onClose() {
			res.end();
		}

		function onError(err) {
			console.log('[respond file] ' + err.toString());
			res.end();
		}
	}
}