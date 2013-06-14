// [导出]
exports.enumFiles = enumFiles;

// [模块]
var execFile = require('child_process').execFile,
	resolve = require('path').resolve;

// [变量]
var exeFileName = resolve(__dirname, '../../bin/x86/enum-files.exe');

// enumFiles('f:\\windows\\system32\\', function(result) {
// 	console.log(result.directories);
// });

// [函数]
// # scb()
// # fcb()
function enumFiles(dirPath, scb, fcb) {
	if (typeof dirPath !== 'string') {
		if (fcb) fcb();
		return;
	}

	dirPath = dirPath + '\\*';

	var cp = execFile(exeFileName, [dirPath], {maxBuffer:2*1024*1024}, function(err, stdout) {
		if (err) {
			if (fcb) fcb();
			return;
		}
		
		parse(stdout, scb, fcb);
	});

	cp.on('error', function(err) {
		console.log('[enumFile] ' + err.toString());
		if (fcb) {
			fcb();
		}
	});

	function parse(str, scb, fcb) {
		var result = {
			directories: [],
			files: []
		};

		if (!str) {
			if (fcb) fcb();
			return;
		}

		str = decodeURIComponent(str);
		var pattern = /<([^>]+)>\s(.+)\r\n/g;
		for (var match = pattern.exec(str); match; match = pattern.exec(str)) {
			var type = match[1],
				name = match[2];

			switch(type) {
				case 'dir':
					result.directories.push({name: name});
					break;
				case 'dir.h':
					result.directories.push({name:name, hidden:true});
					break;
				case 'file':
					result.files.push({name:name});
					break;
				case 'file.h':
					result.files.push({name:name, hidden:true});
					break;
				default:
					console.log('[enumFiles] unknwon type: ' + type);
			}
		}

		if (scb) {debugger;
			scb(result);
		}
	}
}