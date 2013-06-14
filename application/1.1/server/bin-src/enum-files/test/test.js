var cp = require('child_process'),
	fs = require('fs');

console.log(process.argv);

cp.execFile('enum-files.exe', [process.argv[2]], function(err, stdout) {
	var str = decodeURIComponent(stdout);
	console.log(str);
});