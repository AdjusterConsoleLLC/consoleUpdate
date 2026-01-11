let isEditing = false;
let editingKey = null;
let editingShortcut = null;
let animationTimeout = null;
let keyPresses = [];
let lastKey = null;
const maxDelay = 500;
let isNewDatabase = true;
const DB_NAME = "BaseConsoleShortcuts";
const STORE_NAME = "shortcuts";

function openDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			let store;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				store = db.createObjectStore(STORE_NAME, { keyPath: "key" });
				isNewDatabase = false;
			} else {
				store = event.currentTarget.transaction.objectStore(STORE_NAME);
			}
			if (!store.indexNames.contains("target")) {
				store.createIndex("target", "target", { unique: true });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = (event) => reject(event.target.error);
	});
}

async function getShortcutByTarget(target) {
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readonly");
		const store = tx.objectStore(STORE_NAME);
		const index = store.index("target");
		const request = index.get(target);
		request.onsuccess = () => {
			resolve(request.result || null);
		};
		request.onerror = (e) => reject(e.target.error);
	});
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(async () => {
        if (!isNewDatabase) return;
        try {
            const db = await openDatabase();
            await uploadDefaults(db);
        } catch (error) {
            showModalMessage("Error uploading default shortcuts:", error);
        }
    }, 1000);
});

async function uploadDefaults(db) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        for (const defaultSC of shortcutsArr) {
            if (defaultSC.key === "") {
                defaultSC.key = `${defaultSC.name} not assigned`;
            }
            store.put(defaultSC);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
    });
}
                    
async function saveShortcut(key, action, target, name, order) {
    if (!key) {
        key = `${name} not assigned`;
    }
    const db = await openDatabase();
    const tx = (await db).transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, action, target, name, order });
}

async function getAllShortcuts() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const tx = (db).transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function deleteShortcut(key) {
    const shortcut = await getShortcutByKey(key);
    if (!shortcut) {
        return;
    }
    await removeShortcut(key);
    const shortcutCheck = await getShortcutByTarget(shortcut.target);
    if (!shortcutCheck) {
        shortcut.key = `${shortcut.name} not assigned`;
        await saveShortcut(shortcut.key, shortcut.action, shortcut.target, shortcut.name, shortcut.order);
    } else {
        return;
    }
}

async function getShortcutByKey(key) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => {
            resolve(request.result || null);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}

async function addShortcut(key, action, target, name, order) {
    const shortcuts = await getAllShortcuts();
    if (shortcuts.some(s => s.key === key)) return;
    await saveShortcut(key, action, target, name, order);
}

async function removeShortcut(key) {
    const db = await openDatabase();
    const tx = (await db).transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
}

function canonicalizeModifierString(modString) {
    if (!modString) return "";
    const parts = modString.split("+").map(s => s.trim().toUpperCase()).filter(Boolean).sort();
    return parts.length === 1 ? parts[0] : parts.join("+");
}

function compareModifierStrings(a, b) {
    return canonicalizeModifierString(a) === canonicalizeModifierString(b);
}

function isModKey(e) {
	return e.key === "Control" || e.key === "Shift" || e.key === "Alt";
}

function getKeyRepresentation(e) {
    if (e.code.startsWith("Digit")) {
        return e.code.replace("Digit", "");
    }
    if (e.code.startsWith("Numpad") && /\d$/.test(e.code)) {
        const num = e.code.replace("Numpad", "");
        return "NUMPAD" + num;
    }
    switch (e.code) {
        case "Space":
            return "SPACE";
        case "Home":
            return "HOME";
        case "End":
            return "END";
        case "PageUp":
            return "PAGEUP";
        case "PageDown":
            return "PAGEDOWN";
        case "Delete":
            return "DELETE";
        case "ArrowUp":
            return "ARROWUP";
        case "ArrowDown":
            return "ARROWDOWN";
        case "ArrowLeft":
            return "ARROWLEFT";
        case "ArrowRight":
            return "ARROWRIGHT";
        case "Escape":
            return "ESCAPE";
        case "Backquote":
            return "BACKQUOTE";
        default:
            return e.key.toUpperCase();
    }
}

const shortcutState = {
    ctrl: false,
    shift: false,
    alt: false,
    nonMod: null
};

function getCurrentModifierString() {
    const mods = [];
    if (shortcutState.ctrl) mods.push("ctrl");
    if (shortcutState.shift) mods.push("shift");
    if (shortcutState.alt) mods.push("alt");
    if (mods.length === 0) return "";
    if (mods.length === 1) return mods[0].toUpperCase();
    return canonicalizeModifierString(mods.join("+"));
}

function restoreShift(e) {
    if (
        (e.key === "ArrowUp" && e.code === "Numpad8") ||
        (e.key === "ArrowDown" && e.code === "Numpad2") ||
        (e.key === "ArrowLeft" && e.code === "Numpad4") ||
        (e.key === "ArrowRight" && e.code === "Numpad6") ||
        (e.key === "Home" && e.code === "Numpad7") ||
        (e.key === "PageUp" && e.code === "Numpad9") ||
        (e.key === "End" && e.code === "Numpad1") ||
        (e.key === "PageDown" && e.code === "Numpad3") ||
        (e.key === "Clear" && e.code === "Numpad5") ||
        (e.key === "Delete" && e.code === "NumpadDecimal")
    ) {
        shortcutState.shift = true;
    }
}

function formatKeyStreak(e) {
	const key = e.key.toUpperCase();
	if (key.length === 1 && key >= 'A' && key <= 'Z') {
		return `KEYSTREAK+${key}`;
	}
	return null;
}

function formatShortcutKey(e) {
    if (isModKey(e)) return;
    restoreShift(e);
    const fullKey = [];
    if (shortcutState.ctrl || shortcutState.shift || shortcutState.alt) fullKey.push(getCurrentModifierString());
    fullKey.push(getKeyRepresentation(e));
    const shortcutKey = fullKey.length === 1 ? fullKey[0] : fullKey.join("+");
    if (isUnmodifiedKey(shortcutKey)) return null;
    return shortcutKey;
}

function isUnmodifiedKey(shortcutKey) {
    if (disEdit.classList.contains('show')) return false;
    return !shortcutState.ctrl && !shortcutState.shift && !shortcutState.alt && !["ENTER", "ESCAPE"].includes(shortcutKey);
}

function isReservedKey(shortcutKey) {
    return RESERVED_KEYS.includes(shortcutKey);
}

const RESERVED_KEYS = ["CTRL+SHIFT+B", "CTRL+SHIFT+C", "ALT+SHIFT+NUMPAD4", "ALT+SHIFT+NUMPAD7", "ALT+SHIFT+NUMPAD6", "CTRL+ALT+DELETE", "ALT+F4"];

async function handleShortcut(e) {
	const shortcutKey = formatShortcutKey(e);
	if (!shortcutKey) return;
	if (isReservedKey(shortcutKey)) {
		if (isEditing) {
			showModalMessage('Reserved Key Combo. Select another');
		}
		return;
	}
	const shortcuts = await getAllShortcuts();
	const matched = shortcuts.find(s => {
		return isEditing ? s.key === shortcutKey : normalizeShortcutMatch(s.key, shortcutKey);
	});
	if (!isEditing || shortcutKey === 'ENTER' || shortcutKey === 'ESCAPE') {
        if (!matched) return;
		executeShortcutAction(matched, e);
	} else {
		handleEditingShortcut(matched, shortcutKey);
	}
}

async function handleKeyStreak(e) {
	const shortcutKey = formatKeyStreak(e);
	if (!shortcutKey) return;
    triggerKeyStreakAnimation();
	const shortcuts = await getAllShortcuts();
	const matched = shortcuts.find(s => s.key === shortcutKey);
	if (!isEditing) {
        if (!matched) return;
		executeShortcutAction(matched, e);
	} else {
		handleEditingShortcut(matched, shortcutKey);
	}
}

function executeShortcutAction(matched, e) {
	e.preventDefault();
	if (matched.action === "click") {
		const btn = document.getElementById(matched.target);
		if (btn) btn.click();
	} else if (matched.action === "executeFunction") {
		if (typeof window[matched.target] === "function") window[matched.target]();
	} else if (matched.action === "showFile") {
		const fileLi = document.getElementById(`userFile${+matched.target}`);
		if (fileLi) fileLi.click();
	} else if (matched.action === "editDisplay") {
		if (document.getElementById('disEdit').classList.contains('show')) {
			const btn = document.getElementById(matched.target);
			if (btn) btn.click();
		}
	}
}

function handleEditingShortcut(matched, shortcutKey) {
	if (matched && editingShortcut && editingShortcut.key !== shortcutKey) {
		showModalMessage(`Conflict detected! Assigned to ${matched.name}`);
	} else {
		document.getElementById("shortcutInput").value = shortcutKey;
		editingKey = shortcutKey;
	}
}

function normalizeShortcutMatch(storedKey, inputKey) {
    if (storedKey === inputKey) return true;
    const numpadRegex = /NUMPAD(\d)/;
    const numberRegex = /(?<!NUMPAD)(\d)/;
    const normalizedStoredKey = storedKey.replace(numpadRegex, "$1");
    const normalizedInputKey = inputKey.replace(numpadRegex, "$1");
    if (numberRegex.test(storedKey)) {
        return normalizedStoredKey === normalizedInputKey;
    }
    return false;
}

function updateUI() {
    document.getElementById("shortcutAltDiv").classList.toggle("active", shortcutState.alt);
    document.getElementById("shortcutControlDiv").classList.toggle("active", shortcutState.ctrl);
    document.getElementById("shortcutShiftDiv").classList.toggle("active", shortcutState.shift);
    const nonModDiv = document.getElementById("shortcutNonModDiv");
    if (shortcutState.nonMod) {
        nonModDiv.classList.add("active");
        nonModDiv.textContent = shortcutState.nonMod.toUpperCase();
    } else {
        nonModDiv.classList.remove("active");
        nonModDiv.textContent = "";
    }
    const connectorAltCtrl = document.getElementById("connectorAltCtrl");
    const connectorAltShift = document.getElementById("connectorAltShift");
    const connectorAltNonMod = document.getElementById("connectorAltNonMod");
    const connectorCtrlShift = document.getElementById("connectorCtrlShift");
    const connectorCtrlNonMod = document.getElementById("connectorCtrlNonMod");
    const connectorShiftNonMod = document.getElementById("connectorShiftNonMod");
    const connectors = [ connectorAltCtrl, connectorAltShift, connectorAltNonMod, connectorCtrlShift, connectorCtrlNonMod, connectorShiftNonMod ];
    connectors.forEach(connector => connector.classList.remove("active"));
    if (shortcutState.alt) {
        if (shortcutState.ctrl) {
            connectorAltCtrl.classList.add("active");
            if (shortcutState.shift) {
                connectorCtrlShift.classList.add("active");
                if (shortcutState.nonMod) {
                    connectorShiftNonMod.classList.add("active");
                }
            } else if (shortcutState.nonMod) {
                connectorCtrlNonMod.classList.add("active");
            }
        } else if (shortcutState.shift) {
            connectorAltShift.classList.add("active");
			if (shortcutState.nonMod) {
				connectorShiftNonMod.classList.add("active");
			}
		} else if (shortcutState.nonMod) {
			connectorAltNonMod.classList.add("active");
		}
    } else if (shortcutState.ctrl) {
        if (shortcutState.shift) {
            connectorCtrlShift.classList.add("active");
            if (shortcutState.nonMod) {
                connectorShiftNonMod.classList.add("active");
            }
        } else if (shortcutState.nonMod) {
            connectorCtrlNonMod.classList.add("active");
        }
    } else if (shortcutState.shift && shortcutState.nonMod) {
        connectorShiftNonMod.classList.add("active");
    }
}

document.addEventListener("DOMContentLoaded", positionConnectors);
function positionConnectors() {
    const connections = generateConnections();
    connections.forEach(({ id, start, end }) => {
        const connector = document.getElementById(id);
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        connector.style.width = `${length}px`;
        connector.style.left = `${start.x}px`;
        connector.style.top = `${start.y}px`;
        connector.style.transformOrigin = "0 50%";
        connector.style.transform = `rotate(${angle}deg) translateY(100px)`;
    });
}

function getElementPosition(id) {
    const element = document.getElementById(id);
    if (!element) return null;
    const computedEl = window.getComputedStyle(element);
    return {
        x: parseFloat(computedEl.left),
        y: parseFloat(computedEl.top)
    };
}

function generateConnections() {
    const computedAltDiv = getElementPosition("shortcutAltDiv");
    const computedShiftDiv = getElementPosition("shortcutShiftDiv");
    const computedControlDiv = getElementPosition("shortcutControlDiv");
    const computedNonModDiv = getElementPosition("shortcutNonModDiv");
    if (!computedAltDiv || !computedShiftDiv || !computedControlDiv || !computedNonModDiv) {
        console.error("One or more elements were not found.");
        return [];
    }
    const height = 35;
    const width = 100;
    return [ { id: "connectorAltShift", start: { x: computedAltDiv.x + width / 2, y: computedAltDiv.y + height / 2 }, end: { x: computedShiftDiv.x + width / 2, y: computedShiftDiv.y + height / 2 } },
        { id: "connectorAltCtrl", start: { x: computedAltDiv.x + width / 2, y: computedAltDiv.y + height / 2 }, end: { x: computedControlDiv.x + width / 2, y: computedControlDiv.y + height / 2 } },
        { id: "connectorAltNonMod", start: { x: computedAltDiv.x + width / 2, y: computedAltDiv.y + height / 2 }, end: { x: computedNonModDiv.x + width / 2, y: computedNonModDiv.y + height / 2 } },
        { id: "connectorCtrlShift", start: { x: computedControlDiv.x + width / 2, y: computedControlDiv.y + height / 2 }, end: { x: computedShiftDiv.x + width / 2, y: computedShiftDiv.y + height / 2 } },
        { id: "connectorCtrlNonMod", start: { x: computedControlDiv.x + width / 2, y: computedControlDiv.y + height / 2 }, end: { x: computedNonModDiv.x, y: computedNonModDiv.y + height / 2 } },
        { id: "connectorShiftNonMod", start: { x: computedShiftDiv.x + width / 2, y: computedShiftDiv.y + height / 2 }, end: { x: computedNonModDiv.x + width / 2, y: computedNonModDiv.y + height / 2 } }
    ];
}

function triggerKeyStreakAnimation() {
	const nonModDiv = document.getElementById("shortcutNonModDiv");
	nonModDiv.classList.add("keystreak");
	setTimeout(() => {
		nonModDiv.classList.remove("keystreak");
	}, 300);
}

document.addEventListener("keydown", e => {
	if (!(e instanceof KeyboardEvent)) return;
	shortcutState.ctrl = e.getModifierState("Control");
	shortcutState.alt = e.getModifierState("Alt");
	shortcutState.shift = e.getModifierState("Shift");
	const modKeyPressed = shortcutState.ctrl || shortcutState.alt || shortcutState.shift;
    if (!modKeyPressed) {
        const now = Date.now();
        const key = e.key.toUpperCase();
        if (key !== lastKey) {
            lastKey = key;
            keyPresses = [];
        }
        keyPresses = keyPresses.filter(t => now - t <= maxDelay);
        keyPresses.push(now);
        const isKeyStreakTrigger = (key.length === 1 && key >= 'A' && key <= 'Z' && keyPresses.length === 3);
        if (isKeyStreakTrigger) {
            keyPresses.length = 0;
            handleKeyStreak(e);
        } 
    }
    if (animationTimeout) {
        if (!isModKey(e)) {
            clearTimeout(animationTimeout);
            animationTimeout = null;
        } else {
            return;
        }
    }
	if (!isModKey(e)) {
		shortcutState.nonMod = getKeyRepresentation(e);
		handleShortcut(e);
		animationTimeout = setTimeout(() => {
			shortcutState.nonMod = "";
			animationTimeout = null;
			updateUI();
		}, 600);
	}
	updateUI();
});

document.addEventListener("keyup", e => {
    if (!(e instanceof KeyboardEvent)) return;
    shortcutState.ctrl = e.getModifierState("Control");
    shortcutState.alt = e.getModifierState("Alt");
    shortcutState.shift = e.getModifierState("Shift");
    if (!isModKey(e)) return; 
    if (animationTimeout) return;
    updateUI();
});

async function renderShortcutList() {
    const shortcuts = await getAllShortcuts();
    const shortcutList = document.getElementById("shortcutList");
    shortcutList.innerHTML = "";
    if (shortcuts.length === 0) {
        shortcutList.innerHTML = `<li id="noShortcuts">No shortcuts to display</li>`;
        document.getElementById("noShortcuts").style.fontStyle = "italic";
        document.getElementById("noShortcuts").style.color = "rgb(240, 240, 240)";
        return;
    }
    shortcuts.sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10));
    shortcuts.forEach((shortcut, index) => {
        if (shortcut.target === 'triggerPositiveAction' || shortcut.target === 'triggerNegativeAction') return;
        const li = document.createElement("li");
        li.classList.add(index % 2 === 0 ? "backgroundD" : "backgroundE");
        const nameSpan = document.createElement("span");
        nameSpan.classList.add("scNameList");
        const targetSpan = document.createElement("span");
        targetSpan.classList.add("scTargetList");
        const keySpan = document.createElement("span");
        keySpan.classList.add("scKeyList");
        const buttonSpan = document.createElement("span");
        buttonSpan.classList.add("scButtonList");
        nameSpan.textContent = shortcut.name;
        targetSpan.textContent = shortcut.target;
        keySpan.textContent = shortcut.key;
        li.appendChild(nameSpan);
        li.appendChild(targetSpan);
        li.appendChild(keySpan);
        const editBtn = document.createElement("button");
        editBtn.classList.add("mini", "standard");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => openEditDialog(shortcut);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn", "standard", "mini");
        deleteBtn.onclick = async () => {
            await deleteShortcut(shortcut.key);
            await renderShortcutList();
        };
        buttonSpan.appendChild(editBtn);
        buttonSpan.appendChild(deleteBtn);
        li.appendChild(buttonSpan);
        shortcutList.appendChild(li);
    });
}

function sortShortcuts(shortcuts) {
	const targetOrder = [
		"layoutMenu",
		"showFileControl",
		"showShortcutEditor",
		"appearance",
		"showToggles",
		"showWelcome",
		"newButton",
		"switchProfile",
	];
	return shortcuts.sort((a, b) => {
		const indexA = targetOrder.indexOf(a.target);
		const indexB = targetOrder.indexOf(b.target);
		if (indexA !== -1 && indexB !== -1) {
			return indexA - indexB;
		}
		if (indexA !== -1) return -1;
		if (indexB !== -1) return 1;
		if (a.action === "editDisplay" && b.action !== "editDisplay") return -1;
		if (b.action === "editDisplay" && a.action !== "editDisplay") return 1;
		if (a.action === "showFile" && b.action !== "showFile") return -1;
		if (b.action === "showFile" && a.action !== "showFile") return 1;
		if (a.action === "showFile" && b.action === "showFile") {
			const numA = parseFloat(a.target) || 0;
			const numB = parseFloat(b.target) || 0;
			return numA - numB;
		}
		return 0;
	});
}

async function openShortcutEditor() {
    document.getElementById("closeShortcut").addEventListener("click", closeShortcutEditor);
    document.getElementById("shortcutOverlay").classList.add("show");
    await renderShortcutList();
}

function closeShortcutEditor() {
    document.getElementById("closeShortcut").removeEventListener("click", closeShortcutEditor);
    document.getElementById("shortcutOverlay").classList.remove("show");
}

async function openEditDialog(shortcut) {
    isEditing = true;
    editingShortcut = shortcut;
    document.getElementById("shortcutEditDialog").classList.add("show");
    document.getElementById("shortcutInput").value = editingShortcut.key;
    document.getElementById("shortcutNameDisp").innerText = editingShortcut.name.toUpperCase();
    positionConnectors();
}

document.getElementById("saveShortcut").addEventListener("click", async () => {
    if (editingShortcut) {
        await removeShortcut(editingShortcut.key);
        editingShortcut.key = editingKey;
        await saveShortcut(editingShortcut.key, editingShortcut.action, editingShortcut.target, editingShortcut.name, editingShortcut.order);
    }
    closeEditDialog();
    await renderShortcutList();
    await populateShortcutLists();
});

document.getElementById("cancelShortcut").addEventListener("click", closeEditDialog);

function closeEditDialog() {
    isEditing = false;
    editingKey = [];
    editingShortcut = null;
    document.getElementById("shortcutEditDialog").classList.remove("show");
}

const positiveActions = {
    "welcomeBacker": "acceptTutorial",
    "storagePanelBacker": "addFileBtn",
    "layoutBacker": "newProfileBtn",
    "appearDiv": "setColors",
    "infoOverlay": "infoDone",
    "setMakerDiv": "saveConfig",
    "quickStartTutorial": "doneQuickTutorial",
    "shortcutEditDialog": "saveShortcut",
    "importPanel": "submitImportSCBtn",
    "shortcutOverlay": "doneQuickTutorial",
    "shortcutEditDialog": "saveShortcut",
    "promptOverlayDiv": "loadButton",
    "confirmSetupDiv": "loadButton",
    "slideMakerOuter": "slideMakerRun"
};

const negativeActions = {
    "cancelBtn": "cancelBtn",
    "setupAssistantBacker": "setupExit",
    "welcomeBacker": "declineTutorial",
    "storagePanelBacker": "closeFileStorage",
    "layoutBacker": "closeLayouts",
    "appearDiv": "exitColor",
    "disEdit": "dispCancel",
    "infoOverlay": "infoCancel",
    "setMakerDiv": "cancelSetMaker",
    "quickStartTutorial": "doneQuickTutorial",
    "importPanel": "cancelImportSCBtn",
    "shortcutEditDialog": "closeEditDialog",
    "shortcutOverlay": "closeShortcut",
    "offCanvasFileList": "areaOne",
    "settingsDrop": "areaOne",
    "profileDropMenu": "areaOne",
    "promptOverlayDiv": "resetButton",
    "confirmSetupDiv": "resetButton",
    "closeDisplayedFile": "closeDisplayedFile",
    "toggleSwitchesHeader": "closeToggleBtn",
    "slideMakerOuter": "slideMakerCancel"
};

function getActiveButton(actionMap) {
    for (const [containerId, buttonId] of Object.entries(actionMap)) {
        const container = document.getElementById(containerId);
        if (container && container.classList.contains("show")) return buttonId;
    }
    return  null;
}

function triggerNegativeAction() {
    const buttonId = getActiveButton(negativeActions);
    if (buttonId) document.getElementById(buttonId)?.click();
    console.log(buttonId, 'fired');
}

function triggerPositiveAction() {
    const buttonId = getActiveButton(positiveActions);
    if (buttonId) document.getElementById(buttonId)?.click();
}

function switchProfile() {
    let currentProfileName = profileManager.currentProfile;
    let profileNames = Object.keys(profileManager.profiles);
    let availableProfiles = profileNames.filter(name => name !== 'userAssist' && name !== currentProfileName);
    if (availableProfiles.length > 0) {
        profileManager.changeProfile(availableProfiles[0]);
    } else {
        showModalMessage("No other profiles available to switch.");
    }
}

async function downloadShortcuts() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = function(event) {
            const data = event.target.result;
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "shortcuts.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        request.onerror = function(event) {
            showModalMessage("Error retrieving shortcuts");
        };
    } catch (error) {
        showModalMessage("Error opening database");
    }
}

document.getElementById("importSCBtn")?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", () => {
        const file = input.files[0];
        if (file) {
            uploadShortcuts(file);
        }
    });
    input.click();
});

async function uploadShortcuts(file) {
    const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
    const data = JSON.parse(fileContent);
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const existingKeys = await new Promise((resolve, reject) => {
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
    for (const record of data) {
        if (!existingKeys.includes(record.key)) {
            await new Promise((resolve, reject) => {
                const req = store.add(record);
                req.onsuccess = resolve;
                req.onerror = reject;
            });
        }
    }
    await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = reject;
    });
}

/* <div id="shortcutAdminBtns">
    <button id="importSCBtn" class="standard">Import</button>
</div> */

async function showShortcutCheatSheet() {
    document.getElementById('shortcutCheatSheets').classList.add('show');
    await populateShortcutLists();
    attachCheatSheetListeners();
    cycleCheatSheets();
}

function closeShortcutCheatSheet() {
    document.getElementById('shortcutCheatSheets').classList.remove('show');
    detachCheatSheetListeners();
}

async function populateShortcutLists() {
    const shortcuts = await getAllShortcuts();
	document.querySelectorAll('.cheatInner').forEach(container => {
		const range = container.getAttribute('data-order-numbers').split('-');
		const startOrder = parseInt(range[0], 10);
		const endOrder = parseInt(range[1], 10);
		const filteredShortcuts = shortcuts.filter(s => {
			const orderNum = parseInt(s.order, 10);
			return orderNum >= startOrder && orderNum <= endOrder;
		}).sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10));
		container.innerHTML = '';
		const ul = document.createElement('ul');
		filteredShortcuts.forEach(shortcut => {
			const li = document.createElement('li');
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${shortcut.name}:`;
            const keySpan = document.createElement('span');
            keySpan.textContent = shortcut.key;
			li.appendChild(nameSpan);
            li.appendChild(keySpan);
			ul.appendChild(li);
		});
		container.appendChild(ul);
	});
}

let currentIndex = -1;
let cheatSheets = [];
function cycleCheatSheets() {
	cheatSheets = Array.from(document.querySelectorAll('.cheatSheet'));
	if (currentIndex === -1) {
		currentIndex = cheatSheets.findIndex(sheet => sheet.classList.contains('show'));
		if (currentIndex === -1) currentIndex = 0;
	}
    
	function updateVisibility() {
		cheatSheets.forEach((sheet, index) => {
			sheet.classList.toggle('show', index === currentIndex);
		});
	}
	updateVisibility();
}

function handleNext() {
	if (cheatSheets.length === 0) return;
	cheatSheets[currentIndex].classList.remove('show');
	currentIndex = (currentIndex + 1) % cheatSheets.length;
	cheatSheets[currentIndex].classList.add('show');
}

function handlePrev() {
	if (cheatSheets.length === 0) return;
	cheatSheets[currentIndex].classList.remove('show');
	currentIndex = (currentIndex - 1 + cheatSheets.length) % cheatSheets.length;
	cheatSheets[currentIndex].classList.add('show');
}

function attachCheatSheetListeners() {
	document.getElementById('nextCheatSheet').addEventListener('click', handleNext);
	document.getElementById('prevCheatSheet').addEventListener('click', handlePrev);
    document.getElementById('closeCheatSheet').addEventListener('click', closeShortcutCheatSheet);
}

function detachCheatSheetListeners() {
	document.getElementById('nextCheatSheet').removeEventListener('click', handleNext);
	document.getElementById('prevCheatSheet').removeEventListener('click', handlePrev);
    document.getElementById('closeCheatSheet').removeEventListener('click', closeShortcutCheatSheet);
}

/* function enableShortcutHoverDisplay() {
	const tooltip = document.getElementById('shortcutHoverTip');
	if (!tooltip) return;

	document.querySelectorAll('[id]').forEach(el => {
		el.addEventListener('mouseenter', async () => {
			const id = el.id;
			if (!id) return;
			const shortcut = await getShortcutByTarget(id);
			if (shortcut && shortcut.key && shortcut.key !== `${shortcut.name} not assigned`) {
				tooltip.textContent = shortcut.key;
				const rect = el.getBoundingClientRect();
				tooltip.style.left = `${rect.left + window.scrollX}px`;
				tooltip.style.top = `${rect.top + window.scrollY - 28}px`;
				tooltip.style.display = 'block';
			}
		});

		el.addEventListener('mouseleave', () => {
			tooltip.style.display = 'none';
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	enableShortcutHoverDisplay();
}); */

function enableShortcutHoverDisplay() {
	const tooltip = document.getElementById('shortcutHoverTip');
	if (!tooltip) return;

	const getScale = () => {
		const transform = getComputedStyle(document.body).transform;
		if (!transform || transform === 'none') return 1;

		const match = transform.match(/matrix\(([^,]+)/);
		return match ? parseFloat(match[1]) : 1;
	};

	document.querySelectorAll('[id]').forEach(el => {
		el.addEventListener('mouseenter', async () => {
			const id = el.id;
			if (!id) return;

			const shortcut = await getShortcutByTarget(id);
			if (!shortcut || !shortcut.key || shortcut.key === `${shortcut.name} not assigned`) return;

			const rect = el.getBoundingClientRect();
			const scale = getScale();

			const adjustedLeft = (rect.left + window.scrollX) / scale;
			const adjustedTop = (rect.top + window.scrollY - 28) / scale;

			tooltip.textContent = shortcut.key;
			tooltip.style.left = `${adjustedLeft}px`;
			tooltip.style.top = `${adjustedTop}px`;
			tooltip.style.display = 'block';
		});

		el.addEventListener('mouseleave', () => {
			tooltip.style.display = 'none';
		});
	});
}


document.addEventListener('DOMContentLoaded', () => {
	enableShortcutHoverDisplay();
});