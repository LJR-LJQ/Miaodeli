#define UNICODE
#define _UNICODE

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

DWORD bitOf(DWORD value, int i);

int main() {
	DWORD v = GetLogicalDrives();
	if (0 == v) {
		// 获取失败
		return 0;
	}

	for (int i = 0, len = sizeof(DWORD) * 8; i < len; ++i) {
		if (0 != bitOf(v, i)) {
			printf("%c\n",i+65);
		}
	}

	return 0;
}

DWORD bitOf(DWORD value, int i) {
	return value & (1 << i);
}