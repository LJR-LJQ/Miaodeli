// 通用的元素建模脚本

// name: 元素名，字符串，不可缺少
// 后续参数都是 function 类型的，用于执行附加动作
// 每一个附加动作函数都接受一个参数，即当前所创建的元素
function E(name) {
	if (!name || typeof name !== 'string') return;
	var e = create(name);
	if (!e) return;
	for (var i = 1, len = arguments.length; i < len; ++i) {
		var func = arguments[i];
		if (typeof func !== 'function') continue;
		try {
			func(e);
		} catch(err) {
			log(err.toString());
		}
	}
	return e;

	function create(name) {
		try {
			return document.createElement(name);
		} catch(err) {
			return undefined;
		}
	}
}

// 可以有任意多个参数，每个参数都是一个字符串
function AddClass() {
	if (arguments.length < 1) {
		return function() {};
	}

	var classList = [];
	for (var i = 0, len = arguments.length; i < len; ++i) {
		var className = arguments[i];
		if (typeof className === 'string' && className.length > 0) {
			classList.push(className);
		}
	}

	return function(e) {
		if (!e) return;
		classList.forEach(function(className) {
			e.classList.add(className);
		});
	}
}

// 可以有任意多个参数，每个参数都是一个元素
function AppendChildren() {
	if (arguments.length < 1) {
		return function() {};
	}

	var elementList = arguments;
	return function(e) {
		if (!e) return;
		for (var i = 0, len = elementList.length; i < len; ++i) {
			var childElement = elementList[i];
			if (typeof childElement !== 'object') continue;
			try {
				e.appendChild(childElement);
			} catch(err) {
				log(err.toString());
			}
		}
	}
}

function SetTextContent(text) {
	return function(e) {
		if (!e) return;
		e.textContent = text;
	}
}

function SetAttribute(attr, value) {
	return function(e) {
		if (!e) return;
		e.setAttribute(attr, value);
	}
}