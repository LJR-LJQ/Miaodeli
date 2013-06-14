html
	head
		title | 喵德利的文件传输机
		@skipme
			script src=../global/javascript/auto-refresh.js type=text/javascript
		link rel=stylesheet href=style/style.css type=text/css
		link rel=stylesheet href=style/header-style.css type=text/css
		link rel=stylesheet href=style/animation.css type=text/css
		script src=../global/javascript/common.js
		script src=../global/javascript/asyncRequest.js
		script src=javascript/data-to-dom.js
		script src=javascript/find-ui-element.js
		script src=javascript/operate-ui-element.js
		script src=javascript/event-handler.js type=text/javascript
		script src=javascript/server-api.js type=text/javascript
		script src=javascript/start-up.js type=text/javascript
	body
		div class=header
			div class=header-content
				div class=padding-container
					div | 喵德利的文件传输机 1.0
			div
				a href=javascript: class=header-switch-button | 喵德利的文件传输机
		div id=container class=container
			div class=seperator
			div class=varea,column-1
				h3 class=class-title | 位置
				div
					ol class=parent-dir-list
					@skipme
						li > a href=javascript: | Computer
						li > a href=javascript: | C:
						li > a href=javascript: | Windows
						li > a href=javascript: | System32
				h3 class=class-title | 目录
				div
					ol class=sub-dir-list
					@skipme
						li > a href=javascript: | addins
						li > a href=javascript: | AppCompat
						li > a href=javascript: | AppPatch
						li > a href=javascript: | Boot
						li > a href=javascript: | Branding
						li > a href=javascript: | CSC
						li > a href=javascript: | Cursors
						li > a href=javascript: | debug
						li > a href=javascript: | diagnostics
						li > a href=javascript: | DigitalLocker
						li > a href=javascript: | Downloaded Installations Installations InstallationsInstallationsInstallationsInstallations Installations
						li > a href=javascript: | Downloaded Program Files
						li > a href=javascript: | ehome
						li > a href=javascript: | en-US
						li > a href=javascript: | Globalization
						li > a href=javascript: | Help
						li > a href=javascript: | IME
						li > a href=javascript: | inf
						li > a href=javascript: | L2Schemas
						li > a href=javascript: | LiveKernelReports
						li > a href=javascript: | Log
						li > a href=javascript: | Logs
						li > a href=javascript: | Microsoft.NET
						li > a href=javascript: | Minidump
						li > a href=javascript: | ModemLogs
						li > a href=javascript: | NITSCNET
						li > a href=javascript: | Offline Web Pages
						li > a href=javascript: | Panther
						li > a href=javascript: | PCHEALTH
						li > a href=javascript: | Performance
						li > a href=javascript: | PLA
						li > a href=javascript: | PolicyDefinitions
						li > a href=javascript: | Prefetch
						li > a href=javascript: | pss
						li > a href=javascript: | Registration
						li > a href=javascript: | RemotePackages
						li > a href=javascript: | rescache
						li > a href=javascript: | Resources
						li > a href=javascript: | SchCache
						li > a href=javascript: | schemas
						li > a href=javascript: | security
						li > a href=javascript: | ServiceProfiles
						li > a href=javascript: | servicing
						li > a href=javascript: | Setup
						li > a href=javascript: | ShellNew
						li > a href=javascript: | SoftwareDistribution
						li > a href=javascript: | Speech
						li > a href=javascript: | symbols
						li > a href=javascript: | system
						li > a href=javascript: | System32
						li > a href=javascript: | TAPI
						li > a href=javascript: | Tasks
						li > a href=javascript: | Temp
						li > a href=javascript: | tracing
						li > a href=javascript: | twain_32
						li > a href=javascript: | Vss
						li > a href=javascript: | Web
						li > a href=javascript: | winsxs

						li > a href=javascript: | addins
						li > a href=javascript: | AppCompat
						li > a href=javascript: | AppPatch
						li > a href=javascript: | Boot
						li > a href=javascript: | Branding
						li > a href=javascript: | CSC
						li > a href=javascript: | Cursors
						li > a href=javascript: | debug
						li > a href=javascript: | diagnostics
						li > a href=javascript: | DigitalLocker
						li > a href=javascript: | Downloaded Installations
						li > a href=javascript: | Downloaded Program Files
						li > a href=javascript: | ehome
						li > a href=javascript: | en-US
						li > a href=javascript: | Globalization
						li > a href=javascript: | Help
						li > a href=javascript: | IME
						li > a href=javascript: | inf
						li > a href=javascript: | L2Schemas
						li > a href=javascript: | LiveKernelReports
						li > a href=javascript: | Log
						li > a href=javascript: | Logs
						li > a href=javascript: | Microsoft.NET
						li > a href=javascript: | Minidump
						li > a href=javascript: | ModemLogs
						li > a href=javascript: | NITSCNET
						li > a href=javascript: | Offline Web Pages
						li > a href=javascript: | Panther
						li > a href=javascript: | PCHEALTH
						li > a href=javascript: | Performance
						li > a href=javascript: | PLA
						li > a href=javascript: | PolicyDefinitions
						li > a href=javascript: | Prefetch
						li > a href=javascript: | pss
						li > a href=javascript: | Registration
						li > a href=javascript: | RemotePackages
						li > a href=javascript: | rescache
						li > a href=javascript: | Resources
						li > a href=javascript: | SchCache
						li > a href=javascript: | schemas
						li > a href=javascript: | security
						li > a href=javascript: | ServiceProfiles
						li > a href=javascript: | servicing
						li > a href=javascript: | Setup
						li > a href=javascript: | ShellNew
						li > a href=javascript: | SoftwareDistribution
						li > a href=javascript: | Speech
						li > a href=javascript: | symbols
						li > a href=javascript: | system
						li > a href=javascript: | System32
						li > a href=javascript: | TAPI
						li > a href=javascript: | Tasks
						li > a href=javascript: | Temp
						li > a href=javascript: | tracing
						li > a href=javascript: | twain_32
						li > a href=javascript: | Vss
						li > a href=javascript: | Web
						li > a href=javascript: | winsxs
			div class=varea,column-2
				h3 class=class-title | 文件
				div
					ol class=file-list
					@skipme
						li > a href=javascript: | _default.pif
						li > a href=javascript: | ativpsrm.bin
						li > a href=javascript: | bfsvc.exe
						li > a href=javascript: | desktop.ini
						li > a href=javascript: | diagerr.xml
						li > a href=javascript: | diagwrn.xml
						li > a href=javascript: | dxsdkuninst.exe
						li > a href=javascript: | explorer.exe
						li > a href=javascript: | fveupdate.exe
						li > a href=javascript: | HelpPane.exe
						li > a href=javascript: | hh.exe
						li > a href=javascript: | IE10_main.log
						li > a href=javascript: | IsUninst.exe
						li > a href=javascript: | mib.bin
						li > a href=javascript: | msdfmap.ini
						li > a href=javascript: | notepad.exe
						li > a href=javascript: | ntbtlog.txt
						li > a href=javascript: | PFRO.log
						li > a href=javascript: | regedit.exe
						li > a href=javascript: | RtlExUpd.dll
						li > a href=javascript: | setupact.log
						li > a href=javascript: | setuperr.log
						li > a href=javascript: | Starter.xml
						li > a href=javascript: | system.ini
						li > a href=javascript: | twain.dll
						li > a href=javascript: | twain_32.dll
						li > a href=javascript: | twunk_16.exe
						li > a href=javascript: | twunk_32.exe
						li > a href=javascript: | Ultimate.xml
						li > a href=javascript: | uninstall.ico
						li > a href=javascript: | wan.ico
						li > a href=javascript: | win.ini
						li > a href=javascript: | WindowsUpdate.log
						li > a href=javascript: | winhelp.exe
						li > a href=javascript: | winhlp32.exe
						li > a href=javascript: | WMSysPr9.prx
						li > a href=javascript: | write.exe
						li > a href=javascript: | xinstaller.dll
						li > a href=javascript: | xinstaller.exe
						li > a href=javascript: | XiuXiu.ico


