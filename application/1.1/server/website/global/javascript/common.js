// 选取满足CSS Selector表达式的元素
// # successCallback(elementList)
function selectAll(selector, successCallback) {
	successCallback = emptyProtect(successCallback);
	try {
		var result = document.querySelectorAll(selector);
		if (result && result.length > 0) {
			var arrary = [];
			for (var i = 0, len = result.length; i < len; ++i) {
				arrary.push(result[i]);
			}
			successCallback(arrary);
		}
	} catch (err) {
		log(err.toString());
	}
}

// 选取满足CSS Selector表达式的元素
// # successCallback()
function addListenerOn(selector, eventName, listener, successCallback) {
	successCallback = emptyProtect(successCallback);
	selectAll(selector, selectAllCallback);

	function selectAllCallback(elements) {
		for (var i = 0, len = elements.length; i < len; ++i) {
			elements[i].addEventListener(eventName, listener);
		}
		successCallback();
	}
}

// # successCallback()
function appendChildren(element, children, successCallback) {
	if (!element) return;
	successCallback = emptyProtect(successCallback);

	if (!children) {
		successCallback();
		return;
	}

	for (var i = 0, len = children.length; i < len; ++i) {
		element.appendChild(children[i]);
	}

	successCallback();
}

// # successCallback()
function removeChildren(element, successCallback) {
	if (!element) return;
	successCallback = emptyProtect(successCallback);
	while(element.firstChild) {
		element.removeChild(element.firstChild);
	}
	successCallback();

	// 删除元素上的事件监听器和数据引用等
	// 避免内存泄露
	function cleanElement() {
		// TODO
	}
}

function emptyProtect(func) {
	return typeof func === 'function' ? func : emptyFunc;
}

function emptyFunc() {
	log('empty func invoked');
}

function log() {
	try {
		if (console && typeof console.log === 'function') {
			console.log.apply(console, arguments);
		}
	} catch(err) {
		
	}
}