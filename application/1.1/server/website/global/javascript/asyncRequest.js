
// # scb(resObj)
function asyncRequest(reqObj, scb) {
	scb = emptyProtect(scb);

	var xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open('POST', document.location.pathname, true);
	xmlHttpReq.setRequestHeader('content-type', 'application/json;charset=utf-8');
	xmlHttpReq.onreadystatechange = function() {
		if (xmlHttpReq.readyState !== 4) return;
		if (xmlHttpReq.status === 200) {
			// 将结果解析出来，并调用回调函数进行通知
			try {
				var resObj = JSON.parse(xmlHttpReq.responseText);
				scb(resObj);
			} catch(err) {

			}
		}
	};
	xmlHttpReq.send(JSON.stringify(reqObj));
}