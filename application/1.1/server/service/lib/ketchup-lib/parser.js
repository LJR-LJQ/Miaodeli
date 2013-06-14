// [导出]
exports.parse = parse;

// [模块]
var inlineParser = require('./inline-parser.js'),
	isWhiteSpace = require('./common.js').isWhiteSpace;

/*
	名称：语法解析函数
	参数：
	1、inputStr：输入字串
	2、callback：解析完毕后的回调函数
	返回值：
	如果解析失败返回 false（布尔类型）
	如果解析成功返回一个对象，该对象形如： {name: '节点名称', level: 数字, children: [...子节点对象...]}

	函数行为说明：
	本函数能够解析符合番茄酱(Ketchup)语言的字符串并构造出语义等价的AST语法树返回
*/
function parse(inputStr) {
	// 流程概述
	// 1、将输入字符串分割成行数组
	// 2、解析每一行，将其转换为节点对象
	// 3、分析节点对象间的缩进关系，将他们连接成树
	// 4、返回树的根节点

	// [变量]
	var rootNode,
		nodeList;

	// [流程]
	rootNode = createNode('root', -1);

	if (typeof inputStr !== 'string' || inputStr.length < 1) {
		// inputStr 不是字符串（例如 null、undefined、其他类型），或者是空字符串
		// 则直接返回根节点即可
		return rootNode;
	}

	nodeList = toLines(inputStr).map(function(line) {
		return parseLine(line);
	});

	nodeList.unshift(rootNode);

	toTree(nodeList);

	return rootNode;

	// [函数]
	function createNode(name, level) {
		return {name: name, level: level, children: []};
	}

	function toLines(inputStr) {
		var lines = inputStr.split('\r\n');
		// 删除所有空白的行
		lines = lines.filter(function(line) {
			return !isEmptyLine(line);
		});
		return lines;

		function isEmptyLine(line) {
			if (!line) return true;
			for (var i = 0, len = line.length; i < len; ++i) {
				if (!isWhiteSpace(line[i])) {
					return false;
				}
			}
			return true;
		}
	}

	function parseLine(line) {
		var node,
			level;

		level = countLeadingSpace(line);
		node = inlineParser.parse(line.substring(level, line.length));
		node.level = level;
		return node;

		function countLeadingSpace(line) {
			// 一个 tab 和一个空格等价
			for (var i = 0, len = line.length; i < len; ++i) {
				if (!isWhiteSpace(line[i])) {
					return i;
				}
			}
		}
	}

	function toTree(nodeList) {
		// 思路
		// 对于节点列表(nodeList)中位置在 i 处的元素 e
		// 它的父元素的位置一定小于 i
		// 因此确定其父元素的关键是向比 i 小的方向查找
		// 也就是倒着向上查找
		// 当我们碰到第一个缩进级别(level)比 e 小的元素时
		// 可以肯定它就是 e 的父元素

		// [变量]
		var e,
			parent;

		// [流程]
		while (nodeList.length > 0) {
			e = nodeList.pop();
			debugger;
			// 先修正一下自己的行内子元素
			convertInlineChildLink(e);
			// 然后找到父元素把自己挂接上去
			parent = findParent(e, nodeList);
			if (parent) {
				parent.children.unshift(e);
			}
		}

		return e;

		// [函数]
		function findParent(e, nodeList) {
			for (var i = nodeList.length - 1; i > -1; --i) {
				if (nodeList[i].level < e.level) {
					return nodeList[i];
				}
			}
		}

		function convertInlineChildLink(e) {
			if (!e || !e.inlineChild) return;
			e.children.unshift(e.inlineChild);
			// 递归向下处理
			convertInlineChildLink(e.inlineChild);
			// 删除 inlineChild 属性
			delete e.inlineChild;
		}
	}
}