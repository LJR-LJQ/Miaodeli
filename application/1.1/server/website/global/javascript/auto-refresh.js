(function() {
	var currentMtimeList,
		working;

	working = false;

	initialize(initializeFinishCallback);

	function initialize(finishCallback) {
		waitDoc(waitDocOkCallback);

		function waitDoc(okCallback) {
			// 每隔 500ms 判断一次文档是否已经就绪
			var handle;
			handle = setInterval(function() {
				if (isReady()) {
					clearInterval(handle);
					if (typeof okCallback === 'function') {
						okCallback();
					}
				}
			}, 500);

			function isReady() {
				return document.readyState === 'interactive' || document.readyState === 'complete';
			}
		}

		function waitDocOkCallback() {
			// 发送第一次请求
			requestMtimeService(requestMtimCallback);
		}

		function requestMtimCallback(resObj) {
			if (resObj.error) return;
			// 记录下结果列表就可以了
			currentMtimeList = resObj.mtimeList;
			// 初始化过程结束
			if (typeof finishCallback === 'function') {
				finishCallback();
			}
		}
	}

	function initializeFinishCallback() {
		// 每隔 0.5 秒刷新一次页面
		setInterval(checkAndRefresh, 500);
	}

	function requestMtimeService(callback) {
		var reqObj = {
			serviceId: 'b0ae2e86-a1b6-4e9d-a245-0173e6e8b857',
			action: 'retrive mtime',
			pathList: makePathList()
		};
		asyncRequest(reqObj, callback);

		function asyncRequest(reqObj, callback) {
			// 如果当前有请求尚未完成，则不再发送新的请求
			if (working) return;
			working = true;

			var xmlHttpReq = new XMLHttpRequest();
			xmlHttpReq.open('POST', document.location.pathname, true);
			xmlHttpReq.setRequestHeader('content-type', 'application/json;charset=utf-8');
			xmlHttpReq.onreadystatechange = function() {
				if (xmlHttpReq.readyState !== 4) return;
				if (xmlHttpReq.status === 200) {
					// 将结果解析出来，并调用回调函数进行通知
					try {
						var obj = JSON.parse(xmlHttpReq.responseText);
						callback(obj);
					} catch(err) {

					}
				}

				// 无论是否发生了错误，至此请求完成
				working = false;
			};
			xmlHttpReq.send(JSON.stringify(reqObj));
		}
	}

	function checkAndRefresh() {
		// 从服务器获取最新的修改时间，并比对当前记录的时间
		// 如果服务器的时间值更大，则在当前页面上强制进行刷新
		requestMtimeService(requestMtimeServiceCallback);

		function requestMtimeServiceCallback(resObj) {
			var newMtimeList = resObj.mtimeList;
			if (isChanged(currentMtimeList, newMtimeList)) {
				// 强制从服务器获取新页面，而不是缓存中
				location.reload(true);
			}
		}
	}

	function makePathList() {
		// 针对 script 标签和 link 标签
		// 其他标签暂不处理
		return [document.location.pathname].concat(pathListFromTag('script', 'src')).concat(pathListFromTag('link', 'href'));

		function pathListFromTag(tagName, propName) {
			var pathList = [];
			var tagList = document.getElementsByTagName(tagName);
			for (var i = 0, len = tagList.length; i < len; ++i) {
				var v = tagList[i][propName];
				if (typeof v === 'string' && isSameDomain(v)) {
					v = pathnameOf(v);
					pathList.push(v);
				}
			}
			return pathList;

			function isSameDomain(url) {
				// TODO
				return true;
			}

			function pathnameOf(url) {
				return /[^\/]+:\/\/[^\/]+(\/.*)/g.exec(url)[1];
			}
		}
	}

	function isChanged(oldMtimeList, newMtimeList) {
		if (oldMtimeList.length != newMtimeList.length) return true;

		for (var i = 0, len = newMtimeList.length; i < len; ++i) {
			if (newMtimeList[i].mtime !== oldMtimeList[i].mtime) {
				return true;
				break;
			}
		}
	}
})();