// [模块]
var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	request = require('./lib/request.js').request;

// [变量]
var inputFile,
	outputFile;

// [流程]
if (process.argv.length < 4 || process.argv.length > 5) {
	showUsage();
	return;
}

if (process.length === 5 && process.argv[1].toLowerCase() !== 'debug') {
	showUsage();
	return;
}

debugger;
inputFile = process.argv[process.argv.length - 2];
outputFile = process.argv[process.argv.length - 1];

inputFile = path.resolve(inputFile);
outputFile = path.resolve(outputFile);

console.log('[input ] ' + inputFile);
console.log('[output] ' + outputFile);

autoCompile(inputFile, outputFile);
//compileOnce(inputFile, outputFile);

// [函数]
function requestCallback(resObj) {
	if (resObj.error) {
		console.log(resObj.error);
		console.log();
	} else {
		var d = new Date();
		console.log('[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ']');
		console.log('compiled to: ' + outputFile);
		console.log();
	}
}

function compileOnce(inputFile, outputFile) {
	var reqObj = {
		serviceId: 'ba12d37a-cef7-4d8d-bf8d-15613c61dafa',
		action: 'compile',
		inputFile: inputFile,
		outputFile: outputFile
	};

	request(reqObj, requestCallback);
}

function autoCompile(inputFile, outputFile) {
	compileOnce(inputFile, outputFile);
	watchModify(inputFile, onModify);

	function watchModify(filename, notifyCallback) {
		if (typeof notifyCallback !== 'function') return;
		fs.watchFile(filename, {interval: 1000}, function(curr, prev) {
			if (curr.mtime > prev.mtime) {
				notifyCallback();
			}
		})
	}

	function onModify() {
		compileOnce(inputFile, outputFile);
	}
}

function showUsage() {
	console.log('node [debug] auto-compile.js <input-filename> <output-filename>');
}