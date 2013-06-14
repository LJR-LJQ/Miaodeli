// [导出]
exports.request = request;

// [模块]
var http = require('http');

// [函数]
function request(reqObj, resCallback) {
	if (typeof reqObj !== 'object') return;
	var options = {
		hostname: '127.0.0.1',
		port: 80,
		method: 'POST',
		headers: {
			'content-type': 'application/json;charset=utf-8'
		}
	};

	var req = http.request(options);
	req.on('error', onError);
	req.on('response', onResponse);
	req.end(JSON.stringify(reqObj));

	// [函数]
	function onError(err) {
		debugger;
		console.log(err.toString());
	}

	function onResponse(res) {
		if (res.statusCode !== 200) return;

		var chunks = [],
			totalBytes = 0;

		res.on('data', onData);
		res.on('end', onEnd);

		function onData(chunk) {
			totalBytes += chunk.length;
			chunks.push(chunk);
		}

		function onEnd() {
			if (totalBytes < 1) return;
			var bigBuffer = Buffer.concat(chunks, totalBytes);
			try {
				var resObj = JSON.parse(bigBuffer.toString('utf8'));

				if (typeof resCallback === 'function') {
					try {
						resCallback(resObj);
					} catch(err) {}
				}
			} catch(err) {
				console.log(err.toString());
			}
		}
	}
}