// [导出]
exports.name = 'Local IP';
exports.serviceId = '819b8065-1535-4482-bce7-f24793928cdb';
exports.serveIt = serveIt;
exports.requestOtherService = requestOtherService;

// [模块]
var os = require('os'),
	http = require('http');

// [变量]
var actionMap = {};

// [流程]
actionMap['query local ip'] = onQueryLocalIP;
actionMap['ping'] = onPing;

function serveIt(req, callback) {
	var handler;

	handler = actionMap[req.action];
	if (handler) {
		handler(req, callback);
	} else {
		safeCall(callback, {error: 'unknown action'});
	}
}

function onQueryLocalIP(reqObj, callback) {
	var ipTestList = [];

	var networkInterfaces = os.networkInterfaces();
	if (networkInterfaces) {
		// 遍历每一块网卡中的每一个地址
		// 确定要进行测试的 IP 列表
		for(var name in networkInterfaces) {
			var ni = networkInterfaces[name];
			for (var i = 0, len = ni.length; i < len; ++i) {
				var address = ni[i];
				// 跳过 internal 地址和非 IPv4 地址
				if (address.internal || address.family !== 'IPv4') continue;
				// 169.254. 开头的 IPv4 地址也是无效的 (RFC 5735)
				if (/^169\.254\./.exec(address.address)) continue;
				ipTestList.push(address.address);
			}
		}

		// 开始测试每个 IP
		batchPing(ipTestList, function(successIpList) {
			if (callback) {
				callback(successIpList);
			}
		})
	}

	// # finishCallback(successIpList)
	function batchPing(ipList, finishCallback) {
		var successIpList = [],
			workingCount = 0;

		ipList.forEach(function(ip) {
			++workingCount;

			pingIp(ip, function(sucessIp) {
				// IP 可连通
				successIpList.push(sucessIp);
				console.log('ok ip: ' + sucessIp);

				// 如果任务全部完成了则调用 finishCallback
				--workingCount;
				if (workingCount < 1) {
					finishCallback(successIpList);
				}
			}, function() {
				// IP 不能连通
				console.log('failed ip: ' + ip);

				// 如果任务全部完成了则调用 finishCallback
				--workingCount;
				if (workingCount < 1) {
					finishCallback(successIpList);
				}
			});
		});
	}

	// # scb(ip)
	// # fcb()
	function pingIp(ip, scb, fcb) {
		var url = 'http://' + ip + '/';

		var reqObj = {
			serviceId: '819b8065-1535-4482-bce7-f24793928cdb',
			action: 'ping'
		};

		var reqStr = JSON.stringify(reqObj);

		var options = {
			host: ip,
			port: 80,
			method: 'POST',
			headers: {
				'Connection': 'Close',
				'Content-Type': 'application/json;charset=utf-8',
				'Content-Length': Buffer.byteLength(reqStr, 'utf8')
			}
		};

		var req = http.request(options);
		req.on('socket', onSocket);
		req.on('error', onError);
		req.on('response', onResponse);
		req.end(reqStr);

		function onSocket (socket) {
			socket.setTimeout(500, function() {
				req.abort();
			});
		}

		function onError(err) {
			console.log(err.toString());
			if (fcb) fcb();
		}

		function onResponse(res) {
			if (scb && res.statusCode === 200) {
				scb(ip);
			} else if (fcb) {
				fcb();
			}
		}
	}

}

function onPing(reqObj, callback) {
	console.log('on ping');
	debugger;
	callback({});
}

function requestOtherService(req, callback) {
	safeCall(callback, {error: 'service not found'});
}

function safeCall(callback, resObj) {
	if (typeof callback !== 'function') return;
	try {
		callback(resObj);
	} catch(err) {

	}
}