// 指明链接信息
#pragma comment(lib, "Shell32.lib")
#pragma comment(lib, "Shlwapi.lib")

#define UNICODE
#define _UNICODE

#include <windows.h>
#include <tchar.h>
#include <shellapi.h>
#include <stdio.h>
#include <Shlwapi.h>

HINSTANCE hServer = NULL;
HINSTANCE hClient = NULL;
TCHAR CurrentFileName[MAX_PATH];

int APIENTRY _tWinMain(HINSTANCE hInstance, HINSTANCE hPrev, LPTSTR lpCmdLine, int nCmdShow) {

	// 调整当前工作目录为本可执行程序所在目录
	GetModuleFileName(NULL, CurrentFileName, MAX_PATH);
	PathRemoveFileSpec(CurrentFileName);
	SetCurrentDirectory(CurrentFileName);

	// 进入 infrastructure 目录
	// 使用 node.js 目录下的 node.exe 执行 start-up.js 脚本开始启动过程
	if (SetCurrentDirectory(_T("infrastructure")) == 0) {
		printf("enter directory [infrastructure] failed.\n");
		return 0;
	}

	printf("enter directory [infrastructure] ok.\n");


	if (SetCurrentDirectory(_T("node.js")) == 0) {
		printf("enter directory [node.js] failed.\n");
		return 0;
	}

	printf("enter directory [node.js] ok.\n");


	hServer = ShellExecute(NULL, _T("open"), _T("node.exe"), _T("..\\startup.js"), NULL, SW_HIDE);
	if (!(((int)hServer) > 32)) {
		printf("run node.exe ..\\startup.js failed.");
		return 0;
	}

	printf("run node.exe ..\\startup.js ok.");

	return 0;
}