// [导出]
exports.parse = parse;

// [模块]
var isWhiteSpace = require('./common.js').isWhiteSpace;

// 能够处理下面的形式
// e1 > e2 > e3 | TEXT
// e1 > e2 > e3 :| TEXT
// 属性和值也能处理，包括下面的形式
// e p1=v1 p2=v2
// e p1 p2=v2
// 注意一些容易犯的错误，例如
// e p1 = v1
// 这也能解析，会被解析为 e 有三个无值属性 p1、=、v1
// 因此属性表达式 p1=v1 中是不能有空格存在的
// 但是属性表达式里面允许有 | > :| 这些特殊符号
function parse(lineStr) {
	// 思路
	// 1、解析出行内元素
	// 2、连接行内元素
	// 3、返回行内的第一个元素——算是根元素
		
	return connect(split(lineStr));

	// 返回解析好的节点列表
	function split(lineStr) {
		var elements = [];
		var pos = 0;

		do {
			var e = nextElement();
			if (!e) break;
			
			elements.push(e);
			if (e.name === '|' || e.name === ':|') {
				break;
			}
		} while(pos < lineStr.length)

		return elements;

		function nextElement() {
			var nameBlock;

			// 跳过所有前导连续 > 符号
			// 目前这样做是没有意义的
			// 但是未来可能会更改这一设计
			// todo
			do {
				nameBlock = nextBlock();
			} while(nameBlock === '>')

			if (!nameBlock) {
				return;
			} else if (nameBlock === '|' || nameBlock === ':|') {
				var textNode = {
					name: nameBlock,
					properties: [],
					children: [],
					text: lineStr.substring(pos+1, lineStr.length)
				};
				return textNode;
			} else {
				var node = {
					name: nameBlock,
					properties: [],
					children: []
				};

				// 解析属性值
				while (true) {
					var pvBlock = peekNextBlock();
					if (!pvBlock || pvBlock === '|' || pvBlock === ':|' || pvBlock === '>') {
						break;
					} else {
						pvBlock = nextBlock();
						var pv = parsePropertyValueBlock(pvBlock);
						node.properties.push(pv);	
					}
				}

				return node;
			}

			function nextBlock() {
				pos = skipWhiteSpace(lineStr, pos);
				var endPos = findBlockEnd(lineStr, pos);
				var block = lineStr.substring(pos, endPos);
				pos = endPos;
				return block;

				function findBlockEnd(str, startPos) {
					var endPos = startPos;
					while (endPos < str.length && !isWhiteSpace(str[endPos])) {
						++endPos;
					}
					return endPos;
				}

				function skipWhiteSpace(str, startPos) {
					var endPos = startPos;
					while (endPos < str.length && isWhiteSpace(str[endPos])) {
						++endPos;
					}
					return endPos;
				}

			}

			function peekNextBlock() {
				var _pos = pos;
				var block = nextBlock();
				pos = _pos;
				return block;
			}

			function parsePropertyValueBlock(block) {
				var prop = {
					name: '',
					value: ''
				};

				var pos = undefined;

				for (var i = 0, len = block.length; i < len; ++i) {
					if (block[i] === '=') {
						pos = i;
						break;
					}
				}

				if (pos !== undefined) {
					prop.name = block.substring(0, pos);
					prop.value = block.substring(pos+1, block.length);
				} else {
					prop.name = block;
				}

				return prop;
			}
		}
	}

	// 连接节点列表中的各个元素，返回根元素
	function connect(nodeList) {
		if (!nodeList) return false;
		while (nodeList.length > 0) {
			var n = nodeList.pop();
			if (nodeList.length > 0) {
				nodeList[nodeList.length-1].inlineChild = n;
			} else {
				return n;
			}
		}
	}
}