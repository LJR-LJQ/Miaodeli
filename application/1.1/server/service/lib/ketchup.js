// [导出]
exports.compile = compile;

// [模块]
var fs = require('fs'),
	parser = require('./ketchup-lib/parser.js'),
	outputer = require('./ketchup-lib/outputer.js');


// [函数]
function compile(inputFileName, outputFileName) {
	// [变量]
	var inputFileContent,
		outputFileContent;

	var tree;

	// [流程]
	try {
		if (!fs.existsSync(inputFileName)) {
			return false;
		}

		inputFileContent = fs.readFileSync(inputFileName, {encoding: 'utf8'});
		if (inputFileContent) {
			var tree = parser.parse(inputFileContent);
			if (tree && tree.children) {debugger;
				tree = tree.children[0];
			}
			outputFileContent = outputer.output(tree);

			if (outputFileContent === false) {
				return false;
			}
		} else {
			outputFileContent = '';
		}

		fs.writeFileSync(outputFileName, outputFileContent);
		return true;
	} catch(err) {
		console.log(err.toString());
		return false;
	}
}