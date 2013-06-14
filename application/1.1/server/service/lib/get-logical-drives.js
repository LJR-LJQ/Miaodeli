// [导出]
exports.getLogicalDrives = getLogicalDrives;

// [模块]
var resolve = require('path').resolve,
	execFile = require('child_process').execFile;

// [变量]
var file = resolve(__dirname, '../../bin/get-logical-drives.exe');

// [函数]
// # scb(logicalDriveList)
// logicalDriveList => ["C", "D", ...]
function getLogicalDrives(scb) {
	var cp = execFile(file, [], {}, execFileCallback);

	function execFileCallback(error, stdout, stderr) {
		if (stdout) {
			var logicalDriveList = stdout.split('\r\n');
			// 删除掉空白元素
			logicalDriveList = logicalDriveList.filter(function(item) {
				return item && true;
			});
			scb(logicalDriveList);
		}
	}
}