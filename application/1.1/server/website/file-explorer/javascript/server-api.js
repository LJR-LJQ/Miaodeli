// 依赖：common.js

// <dirInfo>
// parentDirList (array of <pathItem>)
// subDirList (array of <pathItem>)
// fileList (array of <pathItem>)

// <pathItem>
// name
// path

// # scb(dirInfo)
function _queryDir(dirPath, scb) {
	scb = emptyProtect(scb);

	if (dirPath === '/') {
		scb({
			parentDirList: [
				pathItem('/', '/')
			],
			subDirList: [
				pathItem('dir 1', '/dir 1'),
				pathItem('dir 2', '/dir 2')
			],
			fileList: [
				pathItem('file 1', '/dir 1/file 1'),
				pathItem('file 2', '/dir 1/file 2'),
				pathItem('file 3', '/dir 1/file 3')
			]
		});
	} else if (dirPath === '/dir 1') {
		scb({
			parentDirList: [
				pathItem('/', '/'),
				pathItem('dir 1', '/dir 1'),
			],
			subDirList: [
				pathItem('dir 1-1', '/dir 1/dir 1-1'),
				pathItem('dir 1-2', '/dir 1/dir 1-2')
			],
			fileList: [
				pathItem('file 1-1', '/dir 1/file 1'),
				pathItem('file 1-2', '/dir 1/file 2'),
				pathItem('file 1-3', '/dir 1/file 3')
			]
		});
	} else if (dirPath === '/dir 2') {
		scb({
			parentDirList: [
				pathItem('/', '/'),
				pathItem('dir 2', '/dir 2'),
			],
			subDirList: [
				pathItem('dir 2-1', '/dir 2/dir 2-1'),
				pathItem('dir 2-2', '/dir 2/dir 2-2'),
				pathItem('dir 2-3', '/dir 2/dir 2-3')
			],
			fileList: [
				pathItem('file 2-1', '/dir 2/file 2-1'),
			]
		});
	} else {
	}

	function pathItem(name, path) {
		var o = {
			name: name,
			path: path
		};
		return o;
	}
}

function queryDir(dirPath, scb) {
	var reqObj = {
		serviceId: 'deecaaae-aa92-48f4-932c-0ce52025c224',
		action: 'query dir',
		dirPath: dirPath
	};
	asyncRequest(reqObj, asyncRequestScb);

	function asyncRequestScb(resObj) {
		if (typeof resObj.error === 'undefined') {
			scb(resObj);
		} else {
			log(resObj.error);
		}
	}
}
