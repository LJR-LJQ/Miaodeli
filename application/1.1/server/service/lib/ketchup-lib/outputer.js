// [导出]
exports.output = output;

// [模块]
var format = require('util').format;

/*
	名称：输出函数
	参数：
	1、tree：节点树的根节点
	返回值：
	如果解析失败返回 false（布尔类型）
	如果解析成功返回生成的字符串

	函数行为说明：
	本函数能够根据番茄酱(Ketchup)语言的AST语法树生成对应的 html5 字符串
*/
function output(tree) {
	var text = '<!doctype html>\r\n' + tag(tree);
	return text;

	function tag(node) {
		if (node.name.toLowerCase() === '@skipme') {
			return '';
		}

		var propStr,
			content,
			result;

		content = '';
		if (node.name === '|') {
			content = node.text || '';
			result = format('%s', content);
		} else if (node.name === ':|') {
			content = htmlEncode(node.text);
			result = format('%s', content);
		} else {
			propStr = '';
			if (node.properties && node.properties.length > 0) {
				node.properties.forEach(function(pv) {
					propStr += ' ' + propVal(pv);
				});
			}

			if (node.children) {
				for (var i = 0, len = node.children.length; i < len; ++i) {
					content += tag(node.children[i]);
				}
			}
			result = format('<%s%s>%s</%s>', node.name, propStr, content, node.name);
		}

		return result;

		function propVal(pv) {
			var name,
				value;

			name = pv.name;
			value = pv.value;

			if (typeof value === 'string') {
				// 这里针对 class 属性有特别的支持，逗号自动替换为空格
				if (name.toLowerCase() === 'class') {
					value = value.replace(/,/g, ' ');
				}

				return name + '=\"' + escapeVal(value) + '\"';
			} else {
				return name;
			}

			function escapeVal(str) {
				// TODO 转义功能目前尚未实现
				return str;
			}
		}

		function htmlEncode(str) {
			// TODO html 实体转义功能目前尚未实现
			return str;
		}
	}
}