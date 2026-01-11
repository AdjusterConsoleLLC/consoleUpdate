let lastCalled = null;
let verifiedCalled = null;
let menuState = 0;
let preEditSettings = {};

function customMenu(targetElem, event) {
	event.preventDefault();
	toggleMenuOff();
	document.querySelector('.profileDropdown')?.classList.remove('show');
	document.querySelector('.dropdown')?.classList.remove('show');
	const menuNode = document.querySelectorAll('.CMeditDIV');
	if (Array.from(menuNode).some(node => window.getComputedStyle(node).display !== 'none')) return;
	if (document.querySelectorAll('.snap').length > 0) return;
	if (event.target.closest('#phoneNumbers')) targetElem = document.getElementById('phoneNumbers');
	toggleMenuOn();
	positionMenu(event);
	lastCalled = targetElem?.id || null;
	const conditions = { displayItem: ['D', 'R', 'C'], moveItem: ['P'], deleteCustomItem: ['H', 'X'] };
	for (const [id, allowedClasses] of Object.entries(conditions)) {
		const menuItem = document.getElementById(id);
		const el = lastCalled ? document.getElementById(lastCalled) : null;
		const hasRequiredClass = el && allowedClasses.some(cls => el.classList.contains(cls));
		menuItem.style.display = hasRequiredClass ? 'block' : 'none';
	}
	const nullOnlyItems = ['newButtonItem', 'newPopNoteItem', 'newSetItem', 'newSlideItem'];
	nullOnlyItems.forEach(id => {
		const item = document.getElementById(id);
		item.style.display = lastCalled === null ? 'block' : 'none';
	});

	const shortcutItem = document.getElementById('buttonShortcutItem');
	if (!shortcutItem) return;

	const existingHandler = shortcutItem._shortcutClickHandler;
	if (existingHandler) {
		shortcutItem.removeEventListener('click', existingHandler);
		delete shortcutItem._shortcutClickHandler;
	}

	if (!lastCalled) {
		shortcutItem.style.display = 'none';
		return;
	}

	(async () => {
		const shortcut = await getShortcutByTarget(lastCalled);
		if (!shortcut) {
			shortcutItem.style.display = 'none';
			return;
		}
		shortcutItem.style.display = 'block';
		const handler = async () => {
			shortcutItem.removeEventListener('click', handler);
			delete shortcutItem._shortcutClickHandler;
			await openShortcutEditor();
			await openEditDialog(shortcut);
		};
		shortcutItem._shortcutClickHandler = handler;
		shortcutItem.addEventListener('click', handler, { once: true });
	})();
}

function toggleMenuOff() {
	const menu = document.getElementById("context-menu");
	if (menuState !== 0) {
		menuState = 0;
		menu.classList.remove("visible");
		menuListenEnd();
		const shortcutItem = document.getElementById('buttonShortcutItem');
		if (shortcutItem && shortcutItem._shortcutClickHandler) {
			shortcutItem.removeEventListener('click', shortcutItem._shortcutClickHandler);
			delete shortcutItem._shortcutClickHandler;
		}
	}
}

function toggleMenuOn() {
	const menu = document.getElementById("context-menu");
	if (menuState !== 1) {
		menuState = 1;
		menu.classList.add("visible");
		menuListenStart();
	}
}

function toggleMenuOff() {
	const menu = document.getElementById("context-menu");
	if (menuState !== 0) {
		menuState = 0;
		menu.classList.remove("visible");
		menuListenEnd();
	}
}

function getPosition(e) {
	let posx = 0;
	let posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx =
			e.clientX +
			document.body.scrollLeft +
			document.documentElement.scrollLeft;
		posy =
			e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {
		x: posx,
		y: posy
	};
}

/* function positionMenu(e) {
	const menu = document.getElementById("context-menu");
	let clickCoords = getPosition(e);
	let clickCoordsX = clickCoords.x;
	let clickCoordsY = clickCoords.y;
	sessionStorage.setItem('contextX', clickCoordsX);
	sessionStorage.setItem('contextY', clickCoordsY);
	let menuWidth = menu.offsetWidth + 4;
	let menuHeight = menu.offsetHeight + 4;
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	if (windowWidth - clickCoordsX < menuWidth) {
		menu.style.left = windowWidth - menuWidth + "px";
	} else {
		menu.style.left = clickCoordsX + "px";
	}
	if (windowHeight - clickCoordsY < menuHeight) {
		menu.style.top = windowHeight - menuHeight + "px";
	} else {
		menu.style.top = clickCoordsY + "px";
	}
} */

function positionMenu(e) {
	const menu = document.getElementById("context-menu");
	if (!menu) return;

	const scale = (() => {
		const transform = getComputedStyle(document.body).transform;
		if (!transform || transform === 'none') return 1;
		const match = transform.match(/matrix\(([^,]+)/);
		return match ? parseFloat(match[1]) : 1;
	})();

	const clickX = e.pageX / scale;
	const clickY = e.pageY / scale;
	
	const body = document.body;
	const clickWidth = body.clientWidth - 110;
	const clickHeight = body.clientHeight + 50;

	sessionStorage.setItem('contextX', Math.max(0, Math.min(clickX, clickWidth)));
	sessionStorage.setItem('contextY', Math.max(0, Math.min(clickY, clickHeight)));

	const menuWidth = menu.offsetWidth;
	const menuHeight = menu.offsetHeight;
	const bodyWidth = document.documentElement.clientWidth / scale;
	const bodyHeight = document.documentElement.clientHeight / scale;

	let left = clickX;
	let top = clickY;

	if (bodyWidth - clickX < menuWidth) {
		left = bodyWidth - menuWidth;
	}
	if (bodyHeight - clickY < menuHeight) {
		top = bodyHeight - menuHeight;
	}

	menu.style.left = `${left}px`;
	menu.style.top = `${top}px`;
}

document.addEventListener("click", (e) => {
	const button = e.which || e.button;
	if (button === 1) {
		toggleMenuOff();
	}
});

window.onkeyup = function (e) {
	if (e.keyCode === 27) {
		toggleMenuOff();
	}
};

function editButtons() {
	const selectedButton = document.getElementById(lastCalled);
	if (!selectedButton) {
		verifiedCalled = null;
		lastCalled = null;
		return;
	}
	const elClassList = selectedButton.classList;
	const isUTA = elClassList.contains('userTextareas');
	const hasD = elClassList.contains('D');
    const hasR = elClassList.contains('R');
    const hasC = elClassList.contains('C');
    const hasP = elClassList.contains('P');
	if ((!hasD && !hasR && !hasC && !hasP) || isUTA) {
		verifiedCalled = null;
		lastCalled = null;
		return;
	}
	verifiedCalled = lastCalled;
	if (hasD || hasR) {
		setUpEditDisplay();
	}
	if (hasR && !hasD && !hasC) {
		setUpEditDisplay('x'); 
	}
	if (hasC) {
		setUpContent();
		if (!hasD && !hasR) {
			onlyContent();
		}
	}
	if (!hasC || (!hasD && !hasR)) {
		disableArrows();
	}
	displayListenStart();
	disableAllContext();
	disEdit.classList.add('show');
}

function onlyContent() {
	document.getElementById('displayEditPage').classList.remove('active');
	document.getElementById('contentEditPage').classList.add('active');
	document.getElementById("editPageHeader").innerText = "Edit Content";
}

function disableArrows() {
	document.getElementById('leftPage').disabled = true;
	document.getElementById('rightPage').disabled = true;
}

function setElementsDisplay(elementIds, displayValue) {
    if (!Array.isArray(elementIds)) {
        return;
    }
    elementIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = displayValue;
        }
    });
}

function setUpEditDisplay(x = 'n') {
	setDispEditAndShadow();
	const selectedButton = document.getElementById(verifiedCalled);
	const styleGive = window.getComputedStyle(selectedButton);
	const disEdit = document.getElementById("disEdit");
	const mimic = document.getElementById("mimic");
	const mimicHouse = document.getElementById('mimicHouse');
	copyStyles(selectedButton, mimic);
	mimic.setAttribute("spellcheck", "false");
	mimic.addEventListener("keydown", editableFixes);
	mimic.style.display = '';
	const profileData = profileManager.getCurrentProfileData();
	const colorSet = profileData.colorSet1;
	mimicHouse.style.background = colorSet.background;
	mimicHouse.style.borderRadius = mimic.style.borderRadius;
	mimic.innerText = selectedButton.innerText || profileManager.getAttribute(verifiedCalled, 'innerText');
	preEditSettings.innerText = selectedButton.innerText;
	preEditSettings.fontSize = styleGive.fontSize;
	preEditSettings.color = styleGive.color;
	preEditSettings.fontWeight = styleGive.fontWeight;
	preEditSettings.height = `${selectedButton.offsetHeight}px`;
	preEditSettings.width = `${selectedButton.offsetWidth}px`;
	if (x === 'x') {
		['plus', 'minus', 'Bold', 'Color'].forEach(id => {
			document.getElementById(id).disabled = true;
		});
	}
}

function setDispEditAndShadow() {
	const disEdit = document.getElementById("disEdit");
	const shadowShape = document.getElementById("shadowShape");
	disEdit.style.top = "260px";
	disEdit.style.left = "285px";
	shadowShape.style.top = "260px";
	shadowShape.style.left = "285px";
	profileManager.setAttribute('disEdit', 'top', '260px');
	profileManager.setAttribute('disEdit', 'left', '285px');
	profileManager.setAttribute('shadowShape', 'top', '260px');
	profileManager.setAttribute('shadowShape', 'left', '285px');
}

function setUpContent() {
	const ContentEditor = document.getElementById("ContentEditor");
	ContentEditor.setAttribute("spellcheck", "false");

	const textToUse = profileManager.getAttribute(verifiedCalled, 'output') || "";
	ContentEditor.innerText = textToUse;

	const type = profileManager.getAttribute(verifiedCalled, 'type');
	if (type !== undefined && type !== null && type !== '') {
		const typeRadio = document.getElementById('editButtonType' + type);
		if (typeRadio) {
			typeRadio.checked = true;
		}
	}
}

function submitDisp() {
	const selectedButton = document.getElementById(verifiedCalled);
	const classList = selectedButton.classList;
	if (classList.contains('C')) {
		const newContent = document.getElementById("ContentEditor").innerText;
		profileManager.setAttribute(verifiedCalled, 'output', newContent);
		const checkedRadio = document.querySelector('input[name="editButtonTypeBtn"]:checked');
		profileManager.setAttribute(verifiedCalled, 'type', checkedRadio.value);
	}
	if (classList.contains('D') || classList.contains('R')) {
		const mimic = document.getElementById("mimic");
		const styleGive = window.getComputedStyle(mimic);
		const newDisplay = mimic.innerText;
		selectedButton.innerText = mimic.innerText;
		if (classList.contains('D')) {
			profileManager.setAttribute(verifiedCalled, 'innerText', newDisplay);
			profileManager.setAttribute(verifiedCalled, 'fontSize', styleGive.fontSize);
			profileManager.setAttribute(verifiedCalled, 'color', styleGive.color);
			profileManager.setAttribute(verifiedCalled, 'fontWeight', styleGive.fontWeight);
		}
		if (classList.contains('R')) {
			profileManager.setAttribute(verifiedCalled, 'width', selectedButton.style.width);
			profileManager.setAttribute(verifiedCalled, 'height', selectedButton.style.height);
		}
	}
	endEdit();
}

function endEdit() {
	const selectedButton = document.getElementById(verifiedCalled);
	const disEdit = document.getElementById("disEdit");
	const classList = selectedButton.classList;
	const mimic = document.getElementById("mimic");
	mimic.removeEventListener("keydown", editableFixes);
	mimic.innerText = "";
	mimic.style.color = "";
	mimic.style.webkitTextFillColor = "";
	const ContentEditor = document.getElementById("ContentEditor");
	ContentEditor.innerText = "";
	if (!document.getElementById('displayEditPage').classList.contains("active")) {
		document.getElementById('displayEditPage').classList.add("active");
	}
	if (document.getElementById('contentEditPage').classList.contains("active")) {
		document.getElementById('contentEditPage').classList.remove("active");
	}
	clearPreSettings();
	displayListenEnd();
	reenableButtons();
	document.querySelectorAll(".contextControl").forEach(element => {
		element.disabled = false;
	});
	profileManager.saveToLocalStorage();
	lastCalled = null;
	verifiedCalled = null;
	document.getElementById("editPageHeader").innerText = "Edit Display";
	disEdit.classList.remove('show');
	disEdit.style.top = "519px";
	disEdit.style.left = "284px";
}

function setDefault() {
	const element = document.getElementById(verifiedCalled);
	if (element.classList.contains("X")) return;
    const defaultData = defaultValues[verifiedCalled] || {};
    const attributes = [ "top", "left", "height", "width", "output", "innerText", "color", "fontSize", "fontWeight" ];
    attributes.forEach(attribute => {
        if (defaultData.hasOwnProperty(attribute)) {
            profileManager.setAttribute(verifiedCalled, attribute, defaultData[attribute]);
			if (attribute in element.style) {
				element.style[attribute] = defaultData[attribute];
				if (attribute === 'color') {
					element.style.removeProperty('-webkit-text-fill-color');
				}
			} else if (attribute === "innerText") {
				element.innerText = defaultData[attribute];
			}
        } else {
            profileManager.deleteAttribute(verifiedCalled, attribute);
			if (attribute in element.style) {
				element.style[attribute] = "";
				if (attribute === 'color') {
					element.style.removeProperty('-webkit-text-fill-color');
				}
			} else if (attribute === "innerText") {
				element.innerText = "";
			}
        }
    });

	if (verifiedCalled === 'phoneNumbers') {
		element.innerHTML =
			`<p>Main</p>
			<p>555-555-5555</p>
			<p>Towing</p>
			<p>555-555-5555</p>
			<p>Rental</p>
			<p>555-555-5555</p>
			<p>Payments</p>
			<p>555-555-5555</p>`;
	}
	endEdit();
}

function cancelEdit() {
	const selectedButton = document.getElementById(verifiedCalled);
	const classList = selectedButton.classList;
	if (verifiedCalled !== 'phoneNumbers') {
		selectedButton.innerText = preEditSettings.innerText;
	}
	selectedButton.style.fontSize = preEditSettings.fontSize;
	selectedButton.style.color = preEditSettings.color;
	selectedButton.style.fontWeight = preEditSettings.fontWeight;
	selectedButton.style.height = preEditSettings.height;
	selectedButton.style.width = preEditSettings.width;
	endEdit();
}

function handleMoveClick() {
	const selectedButton = document.getElementById(lastCalled);
	if (!selectedButton || !selectedButton.classList || !selectedButton.classList.contains('P')) return;
	verifiedCalled = lastCalled;
	const modal = document.getElementById('profileModal');
	modal.textContent = "Press 'Enter' to Save or 'Esc' to Cancel";
	modal.classList.add('profileAlert');
	preEditSettings.left = `${selectedButton.offsetLeft}px`;
	preEditSettings.top = `${selectedButton.offsetTop}px`;
	selectedButton.classList.add("snap");
	selectedButton.classList.add("shiny");
	disableAllContext();
	positionListener();
}

function savePosition() {
	const selectedButton = document.getElementById(verifiedCalled);
	profileManager.setAttribute(verifiedCalled, 'top', selectedButton.style.top);
	profileManager.setAttribute(verifiedCalled, 'left', selectedButton.style.left);
	endPosition();
}

function endPosition() {
	const selectedButton = document.getElementById(verifiedCalled);
	const modal = document.getElementById('profileModal');
	selectedButton.classList.remove("snap");
	selectedButton.classList.remove("shiny");
	profileManager.saveToLocalStorage();
	modal.classList.remove('profileAlert');
	lastCalled = null;
	verifiedCalled = null;
	clearPreSettings();
	reenableButtons();
}

function cancelPosition() {
	const selectedButton = document.getElementById(verifiedCalled);
	selectedButton.style.left = preEditSettings.left;
	selectedButton.style.top = preEditSettings.top;
	endPosition();
}

function menuListenStart() {
    document.getElementById("displayItem")?.addEventListener("click", handleEditClick);
    document.getElementById("moveItem")?.addEventListener("click", handleMoveClick);
    document.getElementById("newButtonItem")?.addEventListener('click', handleNewButtonClick);
    document.getElementById("newPopNoteItem")?.addEventListener("click", handleNewPopNoteClick);
    document.getElementById("deleteCustomItem")?.addEventListener("click", deleteCustom);
    document.getElementById("toggleListItem")?.addEventListener("click", toggleListItemHandler);
    document.getElementById("masterResetItem")?.addEventListener("click", MasterReset);
	document.getElementById("newSetItem")?.addEventListener("click", startSetMaker);
	document.getElementById("newSlideItem")?.addEventListener("click", startSlideMaker);
	document.getElementById("appearanceItem")?.addEventListener("click", personalize);
	document.getElementById("profileItem")?.addEventListener("click", handleProfileClick);
	document.getElementById("shortcutItem")?.addEventListener('click', handleShortcutClick);
}

function menuListenEnd() {
    document.getElementById("displayItem")?.removeEventListener("click", handleEditClick);
    document.getElementById("moveItem")?.removeEventListener("click", handleMoveClick);
    document.getElementById("newButtonItem")?.removeEventListener("click", handleNewButtonClick);
    document.getElementById("newPopNoteItem")?.removeEventListener("click", handleNewPopNoteClick);
    document.getElementById("deleteCustomItem")?.removeEventListener("click", deleteCustom);
    document.getElementById("toggleListItem")?.removeEventListener("click", toggleListItemHandler);
    document.getElementById("masterResetItem")?.removeEventListener("click", MasterReset);
	document.getElementById("newSetItem")?.removeEventListener("click", startSetMaker);
	document.getElementById("newSlideItem")?.removeEventListener("click", startSlideMaker);
	document.getElementById("appearanceItem")?.removeEventListener("click", personalize);
	document.getElementById("profileItem")?.removeEventListener("click", handleProfileClick);
	document.getElementById("shortcutItem")?.removeEventListener('click', handleShortcutClick);
}

function handleProfileClick() {
	document.getElementById('layoutBacker').classList.add("show");
}

function handleNewButtonClick() {
	newButton('basicSelection');
}

function handleNewPopNoteClick() {
	newButton('popNoteSelection');
}

async function handleShortcutClick(event) {
	await openShortcutEditor();
}

function handleShortcutEditClick() {
    if (lastCalled) {
        openShortcutContextMenu(lastCalled);
    }
}

function handleEditClick() {
	editButtons();
}

function displayListenStart() {
	document.getElementById("leftPage")?.addEventListener("click", swapPage);
	document.getElementById("rightPage")?.addEventListener("click", swapPage);
	document.getElementById("hplus")?.addEventListener("click", handleHPlusClick);
    document.getElementById("hminus")?.addEventListener("click", handleHMinusClick);
    document.getElementById("wplus")?.addEventListener("click", handleWPlusClick);
    document.getElementById("wminus")?.addEventListener("click", handleWMinusClick);
	document.getElementById("plus")?.addEventListener("click", handlePlusClick);
    document.getElementById("minus")?.addEventListener("click", handleMinusClick);
	document.getElementById("bold")?.addEventListener("click", handleBoldClick);
    document.getElementById("color")?.addEventListener("click", handleColorClick);
    document.getElementById("dispCancel")?.addEventListener("click", cancelEdit);
    document.getElementById("dispSubmit")?.addEventListener("click", submitDisp);
    document.getElementById("dispDefault")?.addEventListener("click", setDefault);
}

function positionListener() {
	const selectedButton = document.getElementById(verifiedCalled);	
    function positionKeydownHandler(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            savePosition();
            stopPositionListening();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancelPosition();
            stopPositionListening();
        } else if (event.key === "ArrowUp") {
			event.preventDefault();
			const initialTop = parseInt(selectedButton.style.top, 10);
			selectedButton.style.top = (initialTop - 10) + "px";
		} else if (event.key === "ArrowDown") {
			const initialTop = parseInt(selectedButton.style.top, 10);
			event.preventDefault();
			selectedButton.style.top = (initialTop + 10) + "px";
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			const initialLeft = parseInt(selectedButton.style.left, 10);
			selectedButton.style.left = (initialLeft - 10) + "px";
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			const initialLeft = parseInt(selectedButton.style.left, 10);
			selectedButton.style.left = (initialLeft + 10) + "px";
		}
    } 
    document.addEventListener("keydown", positionKeydownHandler);
    function stopPositionListening() {
        document.removeEventListener("keydown", positionKeydownHandler);
    }
}

function displayListenEnd() {
	document.getElementById("leftPage")?.removeEventListener("click", swapPage);
	document.getElementById("rightPage")?.removeEventListener("click", swapPage);
	document.getElementById("hplus")?.removeEventListener("click", handleHPlusClick);
    document.getElementById("hminus")?.removeEventListener("click", handleHMinusClick);
    document.getElementById("wplus")?.removeEventListener("click", handleWPlusClick);
    document.getElementById("wminus")?.removeEventListener("click", handleWMinusClick);
	document.getElementById("plus")?.removeEventListener("click", handlePlusClick);
    document.getElementById("minus")?.removeEventListener("click", handleMinusClick);
	document.getElementById("bold")?.removeEventListener("click", handleBoldClick);
    document.getElementById("color")?.removeEventListener("click", handleColorClick);
    document.getElementById("dispCancel")?.removeEventListener("click", cancelEdit);
    document.getElementById("dispSubmit")?.removeEventListener("click", submitDisp);
    document.getElementById("dispDefault")?.removeEventListener("click", setDefault);
}

function handleHPlusClick() {
    heightChange('5');
}

function handleHMinusClick() {
    heightChange('-5');
}

function heightChange(x) {
	const change = parseInt(x);
	const selectedButton = document.getElementById(verifiedCalled);
	const mimic = document.getElementById('mimic');
	const newHeight = mimic.offsetHeight + change;
	mimic.style.height = `${newHeight}px`;
	selectedButton.style.height = `${newHeight}px`;
}

function handleWPlusClick() {
    widthChange('5');
}

function handleWMinusClick() {
    widthChange('-5');
}

function widthChange(x) {
	const change = parseInt(x);
	const selectedButton = document.getElementById(verifiedCalled);
	const mimic = document.getElementById('mimic');
	const newWidth = mimic.offsetWidth + change;
	mimic.style.width = `${newWidth}px`;
	selectedButton.style.width = `${newWidth}px`;
}

function handlePlusClick() {
    fontChange('1');
}

function handleMinusClick() {
    fontChange('-1');
}

function fontChange(x) {
	const change = parseInt(x);
	const selectedButton = document.getElementById(verifiedCalled);
	const mimic = document.getElementById('mimic');
	const fontInt = parseInt(window.getComputedStyle(mimic).fontSize) + change;
	mimic.style.fontSize = `${fontInt}px`;
	selectedButton.style.fontSize = `${fontInt}px`;
	selectedButton.innerText = mimic.innerText;
}

function handleBoldClick() {
    const selectedButton = document.getElementById(verifiedCalled);
	const mimic = document.getElementById('mimic');
    mimic.style.fontWeight = mimic.style.fontWeight !== 'bold' ? 'bold' : 'normal';
	selectedButton.style.fontWeight = mimic.style.fontWeight;
}

function handleColorClick() {
	const mimic = document.getElementById('mimic');
	const selectedButton = document.getElementById(verifiedCalled);
    cycleColor('mimic');
	mimic.style.webkitTextFillColor = mimic.style.color;
	selectedButton.style.color = mimic.style.color;
	selectedButton.style.webkitTextFillColor = mimic.style.color;
	return;
}

function toggleListItemHandler() {
    showTogglesFunct(event);
}

function MasterReset() {
	const userConfirmed = confirm('This will reset everything. Are you sure?');
	if (userConfirmed) {
		if (profileManager) {
			profileManager.profiles = {};
			profileManager.currentProfile = noCurrentProfile();
			profileManager.setConsoleUsingProfile(profileManager.currentProfile);
			refreshElements();
		}
	}
}

function deleteCustom() {
    const buttonID = lastCalled;	
    const selectedButton = document.getElementById(buttonID);
	const profile = profileManager.getCurrentProfileData();
    if ((selectedButton && !selectedButton.classList.contains('X')) || !profile[buttonID]) {
        showModalMessage("That function is not available on this button");
        verifiedCalled = null;
		lastCalled = null;
        return;
    }
    const modal = document.getElementById('profileModal');
    modal.textContent = 'Delete this custom button?';
    modal.classList.add('profileAlert', 'dispFlexCol', 'alignItemsCenter', 'justifyContentCenter', 'gap20');
    const yesButton = document.createElement('button');
    const noButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    noButton.textContent = 'No';
	yesButton.style.padding = '0';
	noButton.style.padding = '0';
    yesButton.classList.add('standard', 'width80', 'height35');
    noButton.classList.add('standard', 'width80', 'height35');
	const buttonDiv = document.createElement("div");
	buttonDiv.classList.add('dispFlex', 'gap20');
    buttonDiv.appendChild(yesButton);
    buttonDiv.appendChild(noButton);
	modal.appendChild(buttonDiv);
    yesButton.addEventListener('click', () => {
        profileManager.deleteElement(lastCalled);
        selectedButton.remove();
        modal.classList.remove('profileAlert');
		verifiedCalled = null;
		lastCalled = null;
    });
    noButton.addEventListener('click', () => {
        showModalMessage('Action canceled!');
        modal.classList.remove('profileAlert');
		verifiedCalled = null;
		lastCalled = null;
    });
}

function editableFixes(event) {
	const selection = window.getSelection();
	if (!selection.rangeCount) return;
	const range = selection.getRangeAt(0);
	if (event.key === " ") {
		event.preventDefault();
		range.deleteContents();
		const nonBreakingSpace = document.createTextNode("\u00A0");
		range.insertNode(nonBreakingSpace);
		range.setStartAfter(nonBreakingSpace);
		range.setEndAfter(nonBreakingSpace);
		selection.removeAllRanges();
		selection.addRange(range);
	} else if (event.key === "Enter") {
		event.preventDefault();
		const lineBreak = document.createElement("br");
		range.insertNode(lineBreak);
		range.setStartAfter(lineBreak);
		range.setEndAfter(lineBreak);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

function copyStyles(elem1, elem2) {
    if (!(elem1 instanceof Element) || !(elem2 instanceof Element)) {
        return;
    }
    const computedStyles = window.getComputedStyle(elem1);
    const appearanceProperties = [
        "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
        "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
        "height", "width", "font-size", "font-family", "font-weight", "font-style", "line-height", 
        "letter-spacing", "text-align", "color", "background", "background-color", "border", 
        "border-width", "border-color", "border-style", "border-radius",
        "box-shadow", "overflow", "display", "visibility", "white-space",
        "vertical-align", "align-items", "justify-content",
        "text-transform", "text-decoration", "opacity", "position",
		"box-sizing"
    ];
    appearanceProperties.forEach(property => {
        elem2.style[property] = computedStyles.getPropertyValue(property);
    });
}

const alreadyDisabledButtons = [];

function disableAllContext() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        if (button.disabled && !alreadyDisabledButtons.includes(button)) {
            alreadyDisabledButtons.push(button);
        }
        if (button.classList.contains('contextControl')) {
			if (!alreadyDisabledButtons.includes(button)) {
				button.disabled = false;
			}
        } else {
            button.disabled = true;
        }
    });
}

function reenableButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        if (!alreadyDisabledButtons.includes(button)) {
            button.disabled = false;
        }
    });
}

function clearPreSettings() {
	Object.keys(preEditSettings).forEach((key) => {
		delete preEditSettings[key];
	});
}

function swapPage(event) {
    const pages = document.querySelectorAll('.editPage');
    let currentIndex = Array.from(pages).findIndex(page => page.classList.contains('active'));
    if (event.target.id === 'rightPage') {
        currentIndex = (currentIndex + 1) % pages.length;
    } else if (event.target.id === 'leftPage') {
        currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    }
    pages.forEach((page, index) => {
        page.classList.remove('active');
        page.style.zIndex = index === currentIndex ? '10' : '1';
    });
    pages[currentIndex].classList.add('active');
	if (pages[currentIndex].id === "displayEditPage") {
		document.getElementById("editPageHeader").innerText = "Edit Display";
	} else if (pages[currentIndex].id === "contentEditPage") {
		document.getElementById("editPageHeader").innerText = "Edit Content";
	}
}

function setEditPosition(elementId) {
	if (!elementId) return;
	const disEdit = document.getElementById("disEdit");
	const targetElement = document.getElementById(elementId);
	if (!disEdit || !targetElement) return;
	const scale = (() => {
		const transform = getComputedStyle(document.body).transform;
		if (!transform || transform === 'none') return 1;
		const match = transform.match(/matrix\(([^,]+)/);
		return match ? parseFloat(match[1]) : 1;
	})();
	const disEditRect = disEdit.getBoundingClientRect();
	const targetRect = targetElement.getBoundingClientRect();
	const disEditWidth = disEditRect.width / scale;
	const disEditHeight = disEditRect.height / scale;
	const targetLeft = targetRect.left / scale;
	const targetRight = targetRect.right / scale;
	const targetTop = targetRect.top / scale;
	const targetBottom = targetRect.bottom / scale;
	const disEditLeft = disEditRect.left / scale;
	const disEditRight = disEditLeft + disEditWidth;
	const disEditTop = disEditRect.top / scale;
	const disEditBottom = disEditTop + disEditHeight;
	const viewportWidth = window.innerWidth / scale - 10;
	const viewportHeight = window.innerHeight / scale - 10;
	let newLeft = disEditLeft;
	let newTop = disEditTop;
	const overlapLeft = targetRight > disEditLeft && targetLeft < disEditLeft + disEditWidth / 2;
	const overlapRight = targetLeft < disEditRight && targetRight > disEditLeft + disEditWidth / 2;
	const overlapTop = targetBottom > disEditTop && targetTop < disEditTop + disEditHeight / 2;
	const overlapBottom = targetTop < disEditBottom && targetBottom > disEditTop + disEditHeight / 2;
	if (overlapLeft) {
		newLeft = targetLeft - disEditWidth - 10;
	} else if (overlapRight) {
		newLeft = targetRight + 10;
	}
	if (overlapTop) {
		newTop = targetTop - disEditHeight - 10;
	} else if (overlapBottom) {
		newTop = targetBottom + 10;
	}
	if (newLeft < 10) newLeft = 10;
	if (newLeft + disEditWidth > viewportWidth) newLeft = viewportWidth - disEditWidth;
	if (newTop < 10) newTop = 10;
	if (newTop + disEditHeight > viewportHeight) newTop = viewportHeight - disEditHeight;
	disEdit.style.left = `${newLeft}px`;
	disEdit.style.top = `${newTop}px`;
}


function createColorCycler() {
    const colors = [
        "black",
        "red",
        "blue",
        "grey",
        "green",
        "pink",
        "var(--glow-txt-color)",
        "var(--glow-outline-color)"
    ];
	
    function getRGBColor(color) {
        const tempElement = document.createElement("div");
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        const rgbColor = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        return rgbColor;
    }
	
    return function(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            showModalMessage(`Element with id '${elementId}' not found.`);
            return;
        }
        const currentColor = window.getComputedStyle(element).color;
        let colorIndex = colors.findIndex(color => getRGBColor(color) === currentColor);
        if (colorIndex === -1) {
            colorIndex = 0;
        } else {
            colorIndex = (colorIndex + 1) % colors.length;
        }
        element.style.color = colors[colorIndex];
    };
}
const cycleColor = createColorCycler();

