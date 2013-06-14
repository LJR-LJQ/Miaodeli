/*version=1.1*/

// [模块]
var path = require('path'),
	http = require('http'),
	fs = require('fs'),
	execFile = require('child_process').execFile,
	metadata = require('./metadata.json'),
	format = require('util').format;

// [变量]
var currentVersion,		// 当前版本
	rukouPath,			// 主程序路径
	updaterFileName,	// 更新脚本文件名（保存时用到）
	xulrunnerExe,		// XULRunner 可执行程序路径
	appIniPath,			// 客户端程序的 application.ini 路径
	updateUrl;			// 自动更新时请求的 URL

// [流程]
currentVersion = metadata.currentVersion;
rukouPath = path.resolve(__dirname, '../', 'application', currentVersion, 'server/rukou.js'),
appIniPath = path.resolve(__dirname, '../', 'application', currentVersion, 'user-interface/application.ini'),
updaterFileName = path.resolve(__dirname, 'updater.js'),
xulrunnerExe = path.resolve(__dirname, 'xulrunner/xulrunner.exe'),
updateUrl = format('http://update.miaodeli.com/%s/updater.js', currentVersion);

console.log('currentVersion>', currentVersion);
console.log('rukouPath>', rukouPath);
console.log('appIniPath>', appIniPath);
console.log('updaterFileName>', updaterFileName);
console.log('xulrunnerExe>', xulrunnerExe);
console.log('updateUrl>', updateUrl);

try {
	// 启动服务端就可以了，界面是由服务端来启动的
	var rukou = require(rukouPath);
	rukou.run(onSuccess, onFailed);

} catch(err) {
	console.log(err.toString());
}

function onSuccess() {
	// 启动用户界面
	var clientProcess = execFile(xulrunnerExe, [appIniPath]);
	clientProcess.on('error', onError);
	clientProcess.on('exit', onExit);

	// [函数]
	function onError(err) {debugger;
		console.log(err.toString());
		// 不能启动客户端就把服务端自身也关闭掉
		process.exit();
	}

	function onExit() {debugger;
		// 客户端退出了就把服务端也关掉
		console.log('client exit');
		process.exit();
	}

}

function onFailed() {
	console.log('run local server failed.');
}

// 执行升级流程
// # scb()
// # fcb()
function doUpdate(scb, fcb) {
	scb = f(scb);
	fcb = f(fcb);

	// 执行升级过程
	downloadUpdater(downloadScb);

	function downloadScb(jsText) {
		// 成功后将升级脚本保存到本地，然后运行它
		fs.writeFileSync(updaterFileName, jsText);
		var updater = require(updaterFileName);
	}

	// 下载升级脚本到内存
	// # scb(jsText)
	// # fcb()
	function downloadUpdater(scb, fcb) {
		var chunks = [],
			totalLength = 0,
			jsText = '';

		scb = f(scb);
		fcb = f(scb);

		// 尝试下载升级脚本并执行
		// 目前初期会采用这种比较原始的方式
		// 未来会引入带版本控制体系的升级机制
		var req = http.request(updateUrl, onResponse);
		req.on('error', onError);
		req.end();

		function onResponse(res) {
			console.log('server responded ' + res.statusCode);
			if (res.statusCode !== 200) {
				console.log('update failed.');
				if (fcb) fcb();
				return;
			}

			res.on('data', onData);
			res.on('end', onEnd);
			res.on('error', onError);

			function onData(data) {
				console.log(data.length + ' bytes');
				totalLength += data.length;
				chunks.push(data);
			}

			function onEnd() {
				console.log(totalLength + ' bytes received.');
				console.log('receive done.');
				var bigBuffer = Buffer.concat(chunks, totalLength);
				try {
					jsText = bigBuffer.toString();
				} catch(err) {
					console.log('convert response to string failed.');
					console.log(err.toString());
				}

				if (scb) {
					scb(jsText);
				}
			}

			function onError(err) {
				console.log(err.toString());
			}
		}

		function onError(err) {
			console.log(err.toString());
		}
	}
}

function f(func) {
	return typeof func === 'function' ? func : protect(func);

	function protect(func) {
		return function() {
			try {
				func();
			} catch(err) {
				console.log(err.toString());
			}
		}
	}

	function emptyFunc() {

	}
}