// [导出]
exports.mime = mime;

// [模块]
var path = require('path');

// [函数]
function mime(filename) {
	var ext,
		contentType;
	ext = path.extname(filename);
	if (ext) {
		ext = ext.toLowerCase();
	}
	switch (ext) {
		case '.htm':
		case '.html':
			contentType = 'text/html;charset=utf-8';
			break;
		case '.js':
			contentType = 'text/javascript;charset=utf-8';
			break;
		case '.css':
			contentType = 'text/css;charset=utf-8';
			break;
		case '.jpe':
		case '.jpg':
		case '.jpeg':
			contentType = 'image/jpeg';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.gif':
			contentType = 'image/gif';
			break;
		case '.wav':
			contentType = 'audio/wav';
			break;
		case '.mp3':
			contentType = 'audio/mpeg';
			break;
		case '.ttf':
			contentType = 'application/x-font-truetype';
			break;
		default:
			contentType = 'application/octet-stream';
			break;
	}
	return contentType;
}