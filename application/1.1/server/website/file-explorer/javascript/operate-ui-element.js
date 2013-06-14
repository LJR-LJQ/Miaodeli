// 依赖：common.js
// 依赖：find-ui-element.js

// # scb()
function parentDirList_ReplaceChildren(children, scb) {
	parentDirList(function(e) {
		removeChildren(e, function() {
			appendChildren(e, children, scb);
		});
	});
}

// # scb()
function subDirList_ReplaceChildren(children, scb) {
	subDirList(function(e) {
		removeChildren(e, function() {
			appendChildren(e, children, scb);
		});
	});
}

// # scb()
function fileList_ReplaceChildren(children, scb) {
	fileList(function(e) {
		removeChildren(e, function() {
			appendChildren(e, children, scb);
		});
	});
}


var isHeaderExpanded = false;

function expandHeader() {
	headerContent(function(e) {
		isHeaderExpanded = true;
		e.classList.add('expanded');
	});
}

function collapseHeader() {
	headerContent(function(e) {
		isHeaderExpanded = false;
		e.classList.remove('expanded');
	})
}

function switchHeader() {
	if (isHeaderExpanded) {
		collapseHeader();
	} else {
		expandHeader();
	}
}