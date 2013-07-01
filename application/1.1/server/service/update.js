// [导出]
exports.dirMD5 = dirMD5;

// [模块]
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');


// [函数]
/*
	名称：遍历目录函数
	参数：
	1、p：需要遍历的目录 如：'./dirName'
	返回值：
	如果解析成功返回json对象：{files:[], dirs:[], name:path.basename(p)}
	注：没有处理错误

	函数行为说明：
	遍历目录，计算文件MD5，生成json对象
*/
function dirMD5(p)
{
	var obj = {files:[], dirs:[], name:path.basename(p)};
	walk(p, obj);
	return obj;
}

function walk(p, obj){
	var files = fs.readdirSync(p);
	files.forEach(function(item){
		var tmpPath = p + '/' + item;
		var stat = fs.statSync(tmpPath);
		if (stat.isDirectory()) {
			var dir = {files:[], dirs:[], name:item}; 
        	obj.dirs.push(dir);
            walk(tmpPath, dir);
        } else {
        	var shasum = crypto.createHash('sha1');
        	shasum.update(fs.readFileSync(tmpPath));
        	var file = {md5:shasum.digest('hex'), name:item};
        	obj.files.push(file);
        }
	});
}

// [测试]
var p = './dirName';
console.log(dirMD5(p));