#include <windows.h>
#include <stdio.h>

static char hexTable[] = {
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	'a', 'b', 'c', 'd', 'e', 'f'
};

static char pBuffer[1024*100];

static
int Unicode2Utf8(LPCWSTR lpUnicodeStr, 
				 int cchUnicodeChar, 
				 LPSTR lpUtf8Str, 
				 int cbUtf8Byte) {

	return WideCharToMultiByte(
			CP_UTF8,
			0,
			lpUnicodeStr,
			cchUnicodeChar,
			lpUtf8Str,
			cbUtf8Byte,
			NULL,
			NULL
		);
}

static
void PrintHex(unsigned char c) {
	unsigned char lo = c & 0xF;
	unsigned char hi = c >> 4;
	printf("%%%c%c", hexTable[hi], hexTable[lo]);
}

static
void PrintAsHex(char * str, unsigned int len) {
	if (str == NULL || len < 0) {
		return;
	}

	for (unsigned int i = 0; i < len; ++i) {
		PrintHex((unsigned char)str[i]);
	}
}

void EncodeAndPrint(LPCWSTR lpUnicodeStr, int cchUnicodeChar) {
	int len = 0;
	len = Unicode2Utf8(lpUnicodeStr, 
					   cchUnicodeChar, 
					   (LPSTR)pBuffer,
					   1024*100);
	if (0 != len) {
		PrintAsHex(pBuffer, len);
	}
}