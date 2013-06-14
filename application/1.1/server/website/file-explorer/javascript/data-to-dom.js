// 依赖：无

// # scb(domObj)
function d2d_subDir(obj, scb) {
	d2d_general(obj, 'javascript:', function(domObj) {
		domObj.addEventListener('click', onClickSubDir);
		scb(domObj);
	});
}

// # scb(domObj)
function d2d_parentDir(obj, scb) {
	d2d_general(obj, 'javascript:', function(domObj) {
		domObj.addEventListener('click', onClickParentDir);
		scb(domObj);
	});
}

// # scb(domObj)
function d2d_file(obj, scb) {
	var href = '/?serviceId=deecaaae-aa92-48f4-932c-0ce52025c224&filePath=' + obj.path;
	href = encodeURI(href);

	var a = document.createElement('a');
	a.setAttribute('href', href);
	a.setAttribute('target', '_blank');
	a.textContent = obj.name;

	var li = document.createElement('li');
	li.appendChild(a);
	li._dataObj = obj;

	scb(li);
}

// # scb(domObj)
function d2d_general(obj, href, scb) {
	scb = emptyProtect(scb);

	var str = obj.name;

	var a = document.createElement('a');
	a.setAttribute('href', href);
	a.textContent = str;

	var li = document.createElement('li');
	li.appendChild(a);
	li._dataObj = obj;

	scb(li);
}

// # convertMethod(dataItem, scb)
// convertMethod 的 scb 为：scb(domItem)
function appendDataList2Dom(domElement, dataList, convertMethod, scb) {
	if (!domElement || !dataList || !convertMethod) return;
	scb = emptyProtect(scb);

	// 异步遍历数据集合，对每一个元素做特定的操作
	asyncForEach(dataList, itemCallback);

	// # itemCallback(item, scb)
	function asyncForEach(list, itemCallback, finishCallback) {
		if (!list) return;
		itemCallback = emptyProtect(itemCallback);
		finishCallback = emptyProtect(finishCallback);

		var i = -1;
		_(_);

		function _(cb) {
			++i;
			if (i < list.length) {
				itemCallback(list[i], _);
			} else {
				finishCallback();
			}
		}
	}

	// 针对元素的操作过程
	// 1、执行数据转换，把数据对象转为文档模型对象
	// 2、将文档模型对象连接到指定的父元素上
	function itemCallback(dataItem, itemScb) {
		// 执行数据转换
		convertMethod(dataItem, convertScb);

		function convertScb(domItem) {
			// 连接到父元素上
			domElement.appendChild(domItem);
			// 好了，针对当前元素的操作完成了
			itemScb();
		}
	}
}

function setDataList2Dom(domElement, dataList, convertMethod, scb) {
	removeChildren(domElement, function() {
		appendDataList2Dom(domElement, dataList, convertMethod, scb);
	});
}