#define UNICODE
#define _UNICODE

#include <windows.h>
#include <tchar.h>
#include <stdio.h>
#include <locale.h>
#include <wchar.h>

VOID PrintFile(WIN32_FIND_DATA findData);
void EncodeAndPrint(LPCWSTR lpUnicodeStr, int cchUnicodeChar);

int wmain(int argc, wchar_t** argv, wchar_t** envp) {
	setlocale(LC_ALL, "");
	WIN32_FIND_DATAW findData;
	HANDLE hFind;

	if (argc != 2) {
		return 0;
	}

	hFind = FindFirstFileW(argv[1], &findData);
	if (hFind == INVALID_HANDLE_VALUE) {
		//printf("ERROR %d", GetLastError());
		return 0;
	}

	PrintFile(findData);
	
	while(FindNextFile(hFind, &findData)) {
		PrintFile(findData);
	}

	FindClose(hFind);

	return 0;
}

VOID PrintFile(WIN32_FIND_DATA findData) {

	// 针对目录
	if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
		// 不显示 . 和 .. 这两个特殊目录
		if (wcscmp(L".", findData.cFileName) == 0 ||
			wcscmp(L"..", findData.cFileName) == 0) {
			return;
		}

		EncodeAndPrint(L"<dir", 4);

		if (findData.dwFileAttributes & FILE_ATTRIBUTE_HIDDEN) {
			EncodeAndPrint(L".h ", 2);
		}

		EncodeAndPrint(L"> ", 2);

		EncodeAndPrint(findData.cFileName, wcslen(findData.cFileName));
		EncodeAndPrint(L"\r\n", 2);
	} else {
		// 针对文件（其实这里还需要细分）
		EncodeAndPrint(L"<file", 5);


		if (findData.dwFileAttributes & FILE_ATTRIBUTE_HIDDEN) {
			EncodeAndPrint(L".h ", 2);
		}

		EncodeAndPrint(L"> ", 2);

		EncodeAndPrint(findData.cFileName, wcslen(findData.cFileName));
		EncodeAndPrint(L"\r\n", 2);
	}
}
