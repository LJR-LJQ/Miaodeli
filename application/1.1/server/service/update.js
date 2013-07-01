var newMD5 ='{"files":[{"md5":"da39a3ee5e6b4b0d3255bfef95601890afd80709","name":"./dirName/test.txt","action":""},{"md5":"356a192b7913b04c54574d18c28d46e6395428ab","name":"./dirName/test2.txt","action":""}],"dirs":[{"files":[{"md5":"da39a3ee5e6b4b0d3255bfef95601890afd80709","name":"./dirName/test3/test.txt","action":""}],"dirs":[],"name":"./dirName/test3","action":""}],"name":"./dirName"}'
// [导出]
exports.output = output;

// [模块]
var crypto = require('crypto');
var fs = require('fs');


// [函数]
/*
	名称：输出函数
	参数：
	1、p：需要遍历的目录 如：'./dirName'
	返回值：无
	注：没有处理错误

	函数行为说明：
	遍历目录，计算文件MD5，生成json对象，将json字符串写到当前文件开头。
*/
function output(p)
{
	var obj = {files:[], dirs:[], name:p};
	walk(p, obj);
	var fn = './crypto.js';
	var content = fs.readFileSync(fn, {encoding:'utf8'});
	content = content.substring(content.indexOf('\n') + 1);
	var fd = fs.openSync(fn, 'w');
	var buf = new Buffer('var newMD5 =\'' + JSON.stringify(obj) + '\'\n' + content);
	fs.writeSync(fd, buf, 0, buf.length, 0);
}
/*
	名称：比较函数
	参数：
	1、p：需要遍历的目录 如：'./dirName'
	返回值：
	如果解析成功返回json对象数组：
	[{files:[], dirs:[], name:p},
	{files:[], dirs:[], name:p}]
	注：没有处理错误

	函数行为说明：
	遍历目录，计算文件MD5，生成json对象，将此对象与当前文件开头的json对象比较，标记添加或删除的文件。
*/
function compare(p)
{
	var objNew = JSON.parse(newMD5);
	var objOld = {files:[], dirs:[], name:p};
	walk(p, objOld);

	var stackNew = new Array(objNew);
	var stackOld = new Array(objOld);
	while(stackNew.length > 0 && stackOld.length > 0) {
		var popNew = stackNew.pop();
		var popOld = stackOld.pop();
		var filesNew = popNew.files;
		var filesOld = popOld.files;
		for(var i = 0; i < filesNew.length; i++) { // 寻找是否有新添加或被修改的文件，在新的obj中作标记
			var fileNew = filesNew[i];
			var isFind = false;
			for(var j = 0; j < filesOld.length; j++) {
				if(fileNew.name == filesOld[i].name && fileNew.md5 == filesOld[i].md5) {
					isFind = true;
					break;
				}
			}
			if(isFind == false) {
				fileNew.action = 'add';
			}
		}
		for(var i = 0; i < filesOld.length; i++) { // 寻找是否有删除或被修改的文件，在旧的obj中作标记
			var fileOld = filesOld[i];
			var isFind = false;
			for(var j = 0; j < filesNew.length; j++) {
				if(fileOld.name == filesNew[i].name && fileOld.md5 == filesNew[i].md5) {
					isFind = true;
					break;
				}
			}
			if(isFind == false) {
				fileOld.action = 'del';
			}
		}
		var dirsNew = popNew.dirs;
		var dirsOld = popOld.dirs;
		for(var i = 0; i < dirsNew.length; i++) { // 寻找是否有新添加的文件夹，在新的obj中作标记
			var dirNew = dirsNew[i];
			var isFind = false;
			for(var j = 0; j < dirsOld.length; j++) {
				if(dirNew.name == dirsOld[i].name) {
					isFind = true;
					stackNew.push(dirNew); // 入栈遍历
					stackOld.push(dirsOld[i]);
					break;
				}
			}
			if(isFind == false) {
				addFolder(dirNew);
				//dirNew.action = 'add';
			}
		}
		for(var i = 0; i < dirsOld.length; i++) { // 寻找是否有删除的文件夹，在旧的obj中作标记
			var dirOld = dirsOld[i];
			var isFind = false;
			for(var j = 0; j < dirsNew.length; j++) {
				if(dirOld.name == dirsNew[i].name) {
					isFind = true;
					break;
				}
			}
			if(isFind == false) {
				dirOld.action = 'del';
			}
		}
	}
	return [objNew, objOld];
}

function addFolder(obj) {
	obj.action = 'add';
	for(var i = 0; i < obj.files.length; i++) {
		obj.files[i].action = 'add';
	}
	for(var i = 0; i < obj.dirs.length; i++) {
		addFolder(obj.dirs[i]);
	}
}

function walk(p, obj){
	var files = fs.readdirSync(p);
	files.forEach(function(item){
		var tmpPath = p + '/' + item;
		var stat = fs.statSync(tmpPath);
		if (stat.isDirectory()) {
			var dir = {files:[], dirs:[], name:tmpPath, action:''}; 
        	obj.dirs.push(dir);
            walk(tmpPath, dir);
        } else {
        	var shasum = crypto.createHash('sha1');
        	shasum.update(fs.readFileSync(tmpPath));
        	var file = {md5:shasum.digest('hex'), name:tmpPath, action:''};
        	obj.files.push(file);
        }
	});
}

// [测试]
//var p = './dirName';
//output(p);
//compare(p);