onload = function() {
	
	queryLocalIp(scb, fcb);
	
	function scb(ip) {
		setUsage('现在用你的手机浏览器访问 http://' + ip + '/ 吧');
	}

	function fcb() {
		setUsage('抱歉，暂时无法确定这台计算机的网络地址');
	}
}

// scb(ip)
// fcb()
function queryLocalIp(scb, fcb) {
	var reqObj = {
		serviceId: '819b8065-1535-4482-bce7-f24793928cdb',
		action: 'query local ip'
	}

	asyncRequest(reqObj, function(resObj) {
		scb(resObj[0]);
	});
}

function setUsage(str) {
	selectAll('.usage', function(list) {
		list[0].textContent = str;
	});
}