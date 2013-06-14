// [导出]
exports.run = run;

// [模块]
var http = require('http'),
	OnGET = require('./lib/OnGET.js'),
	OnPOST = require('./lib/OnPOST.js');

// # scb()
// # fcb()
function run(scb, fcb) {
	// [变量]
	var server,
		serviceManager;

	// [流程]
	// 首先尝试创建 http 服务
	// 如果不能创建（例如端口被占用）那剩下的步骤也做不了了
	// 因此一定要确保成功创建
	// 创建失败将会引发 error 事件，创建成功则会引发 listening 事件
	server = http.createServer();
	server.listen(80);
	server.on('listening', onListening);
	server.on('error', onError);

	// [函数]
	function onListening() {
		// [流程]
		// 至此 http 服务虽然已经开始监听
		// 但是还无法处理来自客户端的请求，因为整个服务框架还没有初始化
		// 所以下面的代码会先初始化服务框架
		// 完成后才开始处理客户端的请求

		// 初始化服务框架
		// 只要加载 Service Manager 即可
		serviceManager = require('./service/service-manager.js');
		OnGET.serviceManager = serviceManager;
		OnPOST.serviceManager = serviceManager;

		// 然后开始处理请求
		server.on('request', onRequest);

		// 通知上层启动成功
		if (scb) {
			scb();
		}

		// [函数]
		function onRequest(req, res) {
			// 只支持 GET 和 POST 方法
			if (req.method === 'GET') {
				OnGET.handleIt(req, res);
			} else if (req.method === 'POST') {
				OnPOST.handleIt(req, res);
			} else {
				// 返回 405 错误
				// 405: Method Not Allowed
				res.statusCode = 405;
				res.end();
			}
		}
	}

	function onError(err) {
		console.log(err.toString());

		if (fcb) {
			fcb();
		}
	}
}