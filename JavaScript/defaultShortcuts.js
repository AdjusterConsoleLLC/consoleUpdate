const shortcutsArr =
    [
		{
            "key": "ENTER",
            "action": "executeFunction",
            "target": "triggerPositiveAction",
            "name": "Global Positive",
            "order": "0001",
        }, {
            "key": "ESCAPE",
            "action": "executeFunction",
            "target": "triggerNegativeAction",
            "name": "Global Negative",
            "order": "0002",
        }, {
            "key": "CTRL+SHIFT+X",
            "action": "click",
            "target": "showShortcutEditor",
            "name": "Open Shortcut Menu",
            "order": "0003",
        }, {
            "key": "CTRL+SHIFT+Q",
            "action": "executeFunction",
            "target": "showShortcutCheatSheet",
            "name": "Shortcut Cheat Sheet",
            "order": "0004",
        }, {
            "key": "CTRL+SHIFT+F",
            "action": "click",
            "target": "showFileControl",
            "name": "Open File Menu",
            "order": "0005",
        }, {
            "key": "CTRL+SHIFT+P",
            "action": "click",
            "target": "layoutMenu",
            "name": "Open Profile Menu",
            "order": "0006",
        }, {
            "key": "CTRL+SHIFT+A",
            "action": "click",
            "target": "appearance",
            "name": "Open Appearance Menu",
            "order": "0007",
        }, {
            "key": "CTRL+SHIFT+V",
            "action": "click",
            "target": "showToggles",
            "name": "Open Toggle Menu",
            "order": "0008",
        }, {
            "key": "CTRL+SHIFT+T",
            "action": "click",
            "target": "showWelcome",
            "name": "Open Tutorials Menu",
            "order": "0009",
        }, {
            "key": "CTRL+SHIFT+N",
            "action": "executeFunction",
            "target": "newButton",
            "name": "Create New",
            "order": "0010",
        }, {
            "key": "CTRL+SHIFT+L",
            "action": "executeFunction",
            "target": "switchProfile",
            "name": "Switch Profile",
            "order": "0011",
        }, {
            "key": "ALT+CTRL+SHIFT+C",
            "action": "click",
            "target": "part_labor_copy",
            "name": "Copy Text Area",
            "order": "0012",
        }, {
            "key": "ALT+CTRL+SHIFT+R",
            "action": "click",
            "target": "part_labor_reset",
            "name": "Reset",
            "order": "0013",
        }, {
            "key": "CTRL+SHIFT+ARROWUP",
            "action": "editDisplay",
            "target": "hplus",
            "name": "Increase Height",
            "order": "0014",
        }, {
            "key": "CTRL+SHIFT+ARROWDOWN",
            "action": "editDisplay",
            "target": "hminus",
            "name": "Decrease Height",
            "order": "0015",
        }, {
            "key": "CTRL+SHIFT+ARROWRIGHT",
            "action": "editDisplay",
            "target": "wplus",
            "name": "Increase Width",
            "order": "0016",
        }, {
            "key": "CTRL+SHIFT+ARROWLEFT",
            "action": "editDisplay",
            "target": "wminus",
            "name": "Decrease Width",
            "order": "0017",
        }, {
            "key": "CTRL+SHIFT+PAGEUP",
            "action": "editDisplay",
            "target": "plus",
            "name": "Increase Font Size",
			"order": "0018",
        }, {
            "key": "CTRL+SHIFT+PAGEDOWN",
            "action": "editDisplay",
            "target": "minus",
            "name": "Decrease Font Size",
            "order": "0019",
        }, {
            "key": "CTRL+SHIFT+END",
            "action": "editDisplay",
            "target": "bold",
            "name": "Toggle Bold",
            "order": "0020",
        }, {
            "key": "CTRL+SHIFT+HOME",
            "action": "editDisplay",
            "target": "color",
            "name": "Cycle Colors",
            "order": "0021",
        }, {
            "key": "CTRL+SHIFT+S",
            "action": "editDisplay",
            "target": "dispSubmit",
            "name": "Submit",
            "order": "0022",
        }, {
            "key": "CTRL+SHIFT+D",
            "action": "editDisplay",
            "target": "dispDefault",
            "name": "Default",
            "order": "0023",
        }, {
            "key": "CTRL+SHIFT+C",
            "action": "editDisplay",
            "target": "dispCancel",
            "name": "Cancel",
            "order": "0024",
        }, {
            "key": "CTRL+SHIFT+F1",
            "action": "showFile",
            "target": "1",
            "name": "Show File 1",
            "order": "0025",
        }, {
            "key": "CTRL+SHIFT+F2",
            "action": "showFile",
            "target": "2",
            "name": "Show File 2",
            "order": "0026",
        }, {
            "key": "CTRL+SHIFT+F3",
            "action": "showFile",
            "target": "3",
            "name": "Show File 3",
            "order": "0027",
        }, {
            "key": "CTRL+SHIFT+F4",
            "action": "showFile",
            "target": "4",
            "name": "Show File 4",
            "order": "0028",
        }, {
            "key": "CTRL+SHIFT+F5",
            "action": "showFile",
            "target": "5",
            "name": "Show File 5",
            "order": "0029",
        }, {
            "key": "CTRL+SHIFT+F6",
            "action": "showFile",
            "target": "6",
            "name": "Show File 6",
            "order": "0030",
        }, {
            "key": "CTRL+SHIFT+F7",
            "action": "showFile",
            "target": "7",
            "name": "Show File 7",
            "order": "0031",
        }, {
            "key": "CTRL+SHIFT+F8",
            "action": "showFile",
            "target": "8",
            "name": "Show File 8",
            "order": "0032",
        }, {
            "key": "CTRL+SHIFT+F9",
            "action": "showFile",
            "target": "9",
            "name": "Show File 9",
            "order": "0033",
        }, {
            "key": "CTRL+SHIFT+F10",
            "action": "showFile",
            "target": "10",
            "name": "Show File 10",
            "order": "0034",
        }, {
            "key": "CTRL+SHIFT+F11",
            "action": "showFile",
            "target": "11",
            "name": "Show File 11",
            "order": "0035",
        }, {
            "key": "CTRL+SHIFT+F12",
            "action": "showFile",
            "target": "12",
            "name": "Show File 12",
            "order": "0036",
        }, {
            "key": "ALT+NUMPAD1",
            "action": "click",
            "target": "b001",
            "name": "Button 1",
            "order": "0037",
        }, {
            "key": "ALT+NUMPAD2",
            "action": "click",
            "target": "b002",
            "name": "Button 2",
            "order": "0038",
        }, {
            "key": "ALT+NUMPAD3",
            "action": "click",
            "target": "b003",
            "name": "Button 3",
            "order": "0039",
        }, {
            "key": "ALT+NUMPAD4",
            "action": "click",
            "target": "b004",
            "name": "Button 4",
            "order": "0040",
        }, {
            "key": "ALT+NUMPAD5",
            "action": "click",
            "target": "b005",
            "name": "Button 5",
            "order": "0041",
        }, {
            "key": "ALT+NUMPAD6",
            "action": "click",
            "target": "b006",
            "name": "Button 6",
            "order": "0042",
        }, {
            "key": "ALT+NUMPAD7",
            "action": "click",
            "target": "b007",
            "name": "Button 7",
            "order": "0043",
        }, {
            "key": "ALT+NUMPAD8",
            "action": "click",
            "target": "b008",
            "name": "Button 8",
            "order": "0044",
        }, {
            "key": "CTRL+NUMPAD1",
            "action": "click",
            "target": "p001",
            "name": "OEM",
            "order": "0045",
        }, {
            "key": "CTRL+NUMPAD2",
            "action": "click",
            "target": "p002",
            "name": "AM",
            "order": "0046",
        }, {
            "key": "CTRL+NUMPAD3",
            "action": "click",
            "target": "p003",
            "name": "Over 250",
            "order": "0047",
        }, {
            "key": "CTRL+NUMPAD4",
            "action": "click",
            "target": "p004",
            "name": "BULK",
            "order": "0048",
        }, {
            "key": "CTRL+NUMPAD5",
            "action": "click",
            "target": "p005",
            "name": "EVAC",
            "order": "0049",
        }, {
            "key": "CTRL+NUMPAD6",
            "action": "click",
            "target": "p006",
            "name": "ALIGN",
            "order": "0050",
        }, {
            "key": "CTRL+NUMPAD7",
            "action": "click",
            "target": "p007",
            "name": "LABOR",
            "order": "0051",
        }, {
            "key": "CTRL+NUMPAD8",
            "action": "click",
            "target": "p008",
            "name": "DIAG",
            "order": "0052",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD1",
            "action": "click",
            "target": "c001_b001",
            "name": "Slide 1 Button 1",
            "order": "0053",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD2",
            "action": "click",
            "target": "c001_b002",
            "name": "Slide 1 Button 2",
            "order": "0054",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD3",
            "action": "click",
            "target": "c001_b003",
            "name": "Slide 1 Button 3",
            "order": "0055",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD4",
            "action": "click",
            "target": "c002_b001",
            "name": "Slide 2 Button 1",
            "order": "0056",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD5",
            "action": "click",
            "target": "c002_b002",
            "name": "Slide 2 Button 2",
            "order": "0057",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD6",
            "action": "click",
            "target": "c002_b003",
            "name": "Slide 2 Button 3",
            "order": "0058",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD7",
            "action": "click",
            "target": "c003_b001",
            "name": "Slide 3 Button 1",
            "order": "0059",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD8",
            "action": "click",
            "target": "c003_b002",
            "name": "Slide 3 Button 2",
            "order": "0060",
        }, {
            "key": "ALT+CTRL+SHIFT+NUMPAD9",
            "action": "click",
            "target": "c003_b003",
            "name": "Slide 3 Button 3",
            "order": "0061",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_b001",
            "name": "Set 1  Output 1",
            "order": "0062",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_b002",
            "name": "Set 1  Output 2",
            "order": "0063",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_b003",
            "name": "Set 1  Output 3",
            "order": "0064",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_ss001_b001",
            "name": "Set1 Sub1 Btn1",
            "order": "0065",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_ss001_b002",
            "name": "Set1 Sub1 Btn2",
            "order": "0066",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_ss001_b003",
            "name": "Set1 Sub1 Btn3",
            "order": "0067",
        }, {
            "key": "",
            "action": "click",
            "target": "s001_ss001_b004",
            "name": "Set1 Sub1 Btn4",
            "order": "0068",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss001_b001",
            "name": "Set2 Sub1 Btn1",
            "order": "0069",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss001_b002",
            "name": "Set2 Sub1 Btn2",
            "order": "0070",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss001_b003",
            "name": "Set2 Sub1 Btn3",
            "order": "0071",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss001_b004",
            "name": "Set2 Sub1 Btn4",
            "order": "0072",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss002_b001",
            "name": "Set2 Sub2 Btn1",
            "order": "0073",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss002_b002",
            "name": "Set2 Sub2 Btn2",
            "order": "0074",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss002_b003",
            "name": "Set2 Sub2 Btn3",
            "order": "0075",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss002_b004",
            "name": "Set2 Sub2 Btn4",
            "order": "0076",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss003_b001",
            "name": "Set2 Sub3 Btn1",
            "order": "0077",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss003_b002",
            "name": "Set2 Sub3 Btn2",
            "order": "0078",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss003_b003",
            "name": "Set2 Sub3 Btn3",
            "order": "0079",
        }, {
            "key": "",
            "action": "click",
            "target": "s002_ss003_b004",
            "name": "Set2 Sub3 Btn4",
            "order": "0080",
        }
	];



/* 


GOOD
ALT plus any NUMPAD
CTRL+SHIFT+NUMPAD
CTRL+SHIFT+Fkeys
ALT+CTRL+letters

BAD 
ALT+CTRL+DELETE
CTRL+SHIFT+DELETE
CTRL+SHIFT+ +/-
SHIFT+ +/-
CTRL+ +/-
ALT+F4
ALT+SHIFT+NUMPAD7 (New Tab)
ALT+SHIFT+NUMPAD6 (Forwards)
ALT+SHIFT+NUMPAD4 (Backkwards)

	part_labor_copy Copy P&L
	part_labor_reset Reset
	
	p001 OEM
	p002 AM
	p003 Over 250
	p004 BULK

	p005 EVAC
	p006 ALIGN
	p007 LABOR
	p008 DIAG
    
    <button id="addModifier" class="standard">Add Modifier</button>

TARGET
layoutMenu
showFileControl
showShortcutEditor
appearance
showToggles
showWelcome
newButton
switchProfile

ACTION
showFile

ACTION
editDisplay   

USED
"CTRL+SHIFT+ARROWUP",
"CTRL+SHIFT+ARROWDOWN",
"CTRL+SHIFT+ARROWLEFT",
"CTRL+SHIFT+PAGEUP",
"CTRL+SHIFT+PAGEDOWN",
"CTRL+SHIFT+END",
"CTRL+SHIFT+HOME",
"CTRL+S",
"CTRL+D",
"CTRL+C",
"ESCAPE",
"ENTER",
"ALT+CTRL+P",
"ALT+CTRL+F",
"ALT+CTRL+S",
"ALT+CTRL+A",
"ALT+CTRL+V",
"ALT+CTRL+T",
"ALT+CTRL+N",
"ALT+CTRL+G",
"CTRL+SHIFT+F1",
"CTRL+SHIFT+F2",
"CTRL+SHIFT+F3",
"CTRL+SHIFT+F4",
"CTRL+SHIFT+F5",
"CTRL+SHIFT+F6",
"CTRL+SHIFT+F7",
"CTRL+SHIFT+F8",
"CTRL+SHIFT+F9",
"CTRL+SHIFT+F10",
"CTRL+SHIFT+F11",
"CTRL+SHIFT+F12",

 */