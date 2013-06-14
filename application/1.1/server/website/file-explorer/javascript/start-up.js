var ProductName = 'FileJump';

onload = function() {
	headerSwitchButton(function(e) {
		e.addEventListener('click', onClickHeaderSwitchButton);
	});

	gotoDir('');
}

var seqNum = 0;
var showHiddenThings = false;

// # scb()
function gotoDir(path, scb) {
	var _seqNum = ++seqNum;

	scb = emptyProtect();
	queryDir(path, queryDirCallback);

	function queryDirCallback(dirInfo) {
		if (_seqNum !== seqNum) {
			return;
		}
		setParentDirList(dirInfo.parentDirList);
		setSubDirList(dirInfo.subDirList);
		setFileList(dirInfo.fileList);
	}

	function setParentDirList(list, scb) {
		parentDirList(function(targetDom) {
			setDataList2Dom(targetDom, list, d2d_parentDir, scb);
		});
	}

	function setSubDirList(list, scb) {
		list = hiddenFilter(list);

		subDirList(function(targetDom) {
			setDataList2Dom(targetDom, list, d2d_subDir, scb);
		});
	}

	function setFileList(list, scb) {
		list = hiddenFilter(list);

		fileList(function(targetDom) {
			setDataList2Dom(targetDom, list, d2d_file, scb);
		});
	}

	function hiddenFilter(list) {
		if (!list) {
			return list;
		}

		if (!showHiddenThings) {
			var newList = [];
			for (var i = 0, len = list.length; i < len; ++i) {
				var item = list[i];
				if (item.hidden === true) {
					continue;
				} else {
					newList.push(item);
				}
			}
			return newList;
		} else {
			return list;
		}

	}
}