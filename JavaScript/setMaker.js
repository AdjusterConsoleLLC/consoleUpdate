const setMakerDiv = document.getElementById('setMakerDiv');
const childConfigDiv = document.getElementById('childConfig');
const childFieldsDiv = document.getElementById('childFields');
const infoDiv = document.getElementById('infoDiv');
const cancelSetMaker = document.getElementById('cancelSetMaker');
const childCountSelect = document.getElementById('childCount');

childCountSelect.addEventListener('change', createChildren);

cancelSetMaker.addEventListener('click', () => {
    document.getElementById('parentText').value = '';
    childFieldsDiv.innerHTML = '';
    childConfigDiv.classList.remove('show');
    setMakerDiv.classList.remove('show');
    disableValidation();
});

function startSetMaker() {
	setMakerDiv.classList.add('show');
    enableValidation();
    createChildren();
}

function createChildren() {
    const childCount = document.getElementById('childCount').value;
    childFieldsDiv.innerHTML = '';
    for (let i = 0; i < childCount; i++) {
        const childFieldContainer = document.createElement('div');
        childFieldContainer.classList.add('childField', 'mainDiv');
        childFieldContainer.innerHTML = `
            <div class="childRow">
                <div class="childCol">
                    <label for="childText-${i}">Child Button ${i + 1} Text:</label>
                    <input type="text" id="childText-${i}" class="mainTextInput" placeholder="Display text">
                </div>
                <div class="childCol">
                    <label for="childTypeParent-${i}">
                        <input id="childTypeParent-${i}" type="radio" name="childType-${i}" value="parent" class="childType"> Parent
                    </label>
                    <label for="childTypeOutput-${i}">
                        <input id="childTypeOutput-${i}" type="radio" name="childType-${i}" value="output" class="childType"> Output
                    </label>
                </div>
            </div>
            <div id="childOptions-${i}" class="hidden fullWidth"></div>
        `;
        childFieldsDiv.appendChild(childFieldContainer);
        const radioButtons = childFieldContainer.querySelectorAll(`input[name="childType-${i}"]`);
        radioButtons.forEach((radio) => {
            radio.addEventListener('change', (event) => {
                const optionsDiv = document.getElementById(`childOptions-${i}`);
                optionsDiv.classList.add('optionsDivs');
                optionsDiv.innerHTML = '';
                if (event.target.value === 'parent') {
                    optionsDiv.innerHTML = `
                        <label for="grandchildCount-${i}">Number of Grandchild Buttons:
                        <select id="grandchildCount-${i}" class="mainSelect">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select></label>
                        <div id="grandchildFields-${i}" class="hidden fullWidth fifty"></div>
                    `;
                    optionsDiv.classList.remove('hidden');
                    const grandchildCountDropdown = optionsDiv.querySelector(`#grandchildCount-${i}`);
                    grandchildCountDropdown.addEventListener('change', populateGrandchildren);
                    function populateGrandchildren() {
                        const grandchildFieldsDiv = optionsDiv.querySelector(`#grandchildFields-${i}`);
                        grandchildFieldsDiv.innerHTML = '';
                        for (let j = 0; j < grandchildCountDropdown.value; j++) {
                            const grandchildFieldContainer = document.createElement('div');
                            grandchildFieldContainer.classList.add(`grandchildField-${i}`, 'centerWide');
                            grandchildFieldContainer.innerHTML = `
                                <div class="grandChildCol">
                                    <div class="assistHeaderType">
                                        <label for="grandchildText-${i}-${j}" class="declareButton"><span class="declareGC">Grandchild<br></span>Button ${j + 1}</label>
                                        <div class="childRow buttonOutputType">
                                            <label class="setTypeClassLabel" for="grandchildOutputClip-${i}-${j}">
                                                <input id="grandchildOutputClip-${i}-${j}" type="radio" name="outputType-${i}-${j}" value="clip" class="setTypeClass"><span class="outputSelectionSpan">Clip</span>
                                            </label>
                                            <span>Type</span>
                                            <label class="setTypeClassLabel" for="grandchildOutputSolo-${i}-${j}">
                                                <input id="grandchildOutputSolo-${i}-${j}" type="radio" name="outputType-${i}-${j}" value="solo" class="setTypeClass"><span class="outputSelectionSpan">Solo</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <input id="grandchildText-${i}-${j}" type="text" class="setOutputIP mainTextInput" placeholder="Display text">
                                        <textarea id="grandchildOutput-${i}-${j}" class="mainTextInput setOutputTA" placeholder="Output"></textarea>
                                    </div>
                                </div>`;
                            grandchildFieldsDiv.appendChild(grandchildFieldContainer);
                        }
                        grandchildFieldsDiv.classList.remove('hidden');
                    }
                    populateGrandchildren();
                } else if (event.target.value === 'output') {
                    optionsDiv.innerHTML = `
                        <div class="childCol">
                            <div class="childCol">
                                <label for="outputText-${i}" class="outputLabel">Output</label>
                                <textarea id="outputText-${i}" class="mainTextInput setOutputTA" placeholder="Output text"></textarea>
                            </div>
                            <div class="childRow outputLabel buttonOutputType">
                                <label class="setTypeClassLabel" for="childOutputClip-${i}">
                                    <input id="childOutputClip-${i}" type="radio" name="outputType-${i}" value="clip" class="setTypeClass"><span class="outputSelectionSpan">Clip</span>
                                </label>
                                <span>Type</span>
                                <label class="setTypeClassLabel" for="childOutputSolo-${i}">
                                    <input id="childOutputSolo-${i}" type="radio" name="outputType-${i}" value="solo" class="setTypeClass"><span class="outputSelectionSpan">Solo</span>
                                </label>
                            </div>
                        </div>`;
                    optionsDiv.classList.remove('hidden');
                }
            });
        });
    }
    childConfigDiv.classList.add('show');
}

const saveConfigButton = document.getElementById('saveConfig');
saveConfigButton.addEventListener('click', () => {
    disableValidation();
    const parentText = document.getElementById('parentText').value;
    const childCount = document.getElementById('childCount').value;
    const timestamp = new Date().getTime().toString();
    const grandfatherId = timestamp + 'cust';
    profileManager.setAttribute(grandfatherId, 'id', grandfatherId);
    profileManager.setAttribute(grandfatherId, 'innerText', parentText);
    profileManager.setAttribute(grandfatherId, 'classes', ['D', 'R', 'P', 'C', 'X', 'A', 'mainButton', 'H']);
    profileManager.setAttribute(grandfatherId, 'display', 'block');
    profileManager.setAttribute(grandfatherId, 'height', '50px');
    profileManager.setAttribute(grandfatherId, 'width', '110px');
    const coordinates = setPosition();
    profileManager.setAttribute(grandfatherId, 'top', coordinates[1]);
    profileManager.setAttribute(grandfatherId, 'left', coordinates[0]);
    profileManager.setAttribute(grandfatherId, 'isParent', true);
    profileManager.setAttribute(grandfatherId, 'parentId', null);
    const childFields = document.querySelectorAll('.childField');
    const children = Array.from(childFields).map((field, index) => {
        const text = field.querySelector(`#childText-${index}`).value;
        const type = field.querySelector(`input[name="childType-${index}"]:checked`).value;
        const childId = new Date().getTime().toString() + `-${index}-cust`;
        profileManager.setAttribute(childId, 'id', childId);
        profileManager.setAttribute(childId, 'innerText', text);
        profileManager.setAttribute(childId, 'classes', ['D', 'R', 'P', 'C', 'X', 'mainButton', 'H']);
        profileManager.setAttribute(childId, 'display', 'none');
        profileManager.setAttribute(childId, 'height', '50px');
        profileManager.setAttribute(childId, 'width', '110px');
        profileManager.setAttribute(childId, 'parentId', grandfatherId);
        if (type === 'parent') {
            const grandchildCount = field.querySelector(`#grandchildCount-${index}`).value;
            const grandchildFields = field.querySelectorAll(`.grandchildField-${index}`);
            profileManager.setAttribute(childId, 'isParent', true);
            const grandchildren = Array.from(grandchildFields).map((grandchildField, grandchildIndex) => {
                const grandchildText = grandchildField.querySelector(`#grandchildText-${index}-${grandchildIndex}`).value;
                const grandchildOutputText = grandchildField.querySelector(`#grandchildOutput-${index}-${grandchildIndex}`).value;
                const grandChildOutputType = grandchildField.querySelector(`input[name="outputType-${index}-${grandchildIndex}"]:checked`).value;
                const grandchildId = new Date().getTime().toString() + `-${index}-${grandchildIndex}-cust`;
                profileManager.setAttribute(grandchildId, 'id', grandchildId);
                profileManager.setAttribute(grandchildId, 'innerText', grandchildText);
                profileManager.setAttribute(grandchildId, 'output', grandchildOutputText);
                profileManager.setAttribute(grandchildId, 'classes', ['D', 'R', 'P', 'C', 'X', 'mainButton', 'H']);
                profileManager.setAttribute(grandchildId, 'display', 'none');
                profileManager.setAttribute(grandchildId, 'height', '50px');
                profileManager.setAttribute(grandchildId, 'width', '110px');
                profileManager.setAttribute(grandchildId, 'type', grandChildOutputType);
                profileManager.setAttribute(grandchildId, 'isParent', false);
                profileManager.setAttribute(grandchildId, 'parentId', childId);
                return grandchildId;
            });
            profileManager.setAttribute(childId, 'children', grandchildren);
        } else if (type === 'output') {
            const outputText = field.querySelector(`#outputText-${index}`).value;
            const childOutputType = field.querySelector(`input[name="outputType-${index}"]:checked`).value;
            profileManager.setAttribute(childId, 'type', childOutputType);
            profileManager.setAttribute(childId, 'output', outputText);
            profileManager.setAttribute(childId, 'classes', ['D', 'R', 'P', 'C', 'X', 'mainButton', 'H']);
            profileManager.setAttribute(childId, 'isParent', false);
        }
        return childId;
    });
    profileManager.setAttribute(grandfatherId, 'children', children);
    arrangeHierarchy(grandfatherId);
    setMakerDiv.classList.remove('show');
    profileManager.setConsoleUsingProfile();
    document.addEventListener('profileRendered', handleRenderComplete, { once: true });
    function handleRenderComplete() {
        setCustomListeners(grandfatherId);
    }
});

function setPosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = parseInt(sessionStorage.getItem('contextX'));
    let top = parseInt(sessionStorage.getItem('contextY'));
    if (left + 110 > viewportWidth) {
        left = viewportWidth - 110;
    }
    if (top + 50 > viewportHeight) {
        top = viewportHeight - 50;
    }
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    
    function getFinal(value) {
        const lastDigit = Math.abs(value) % 10;
        if (lastDigit > 4)  {
            return value + (10 - lastDigit);
        }
        if (lastDigit < 5) {
            return value - lastDigit;
        }
    }
    left = getFinal(left);
    top = getFinal(top);
    return [left + 'px', top + 'px'];
}

function startValidationListeners() {
    const setMakerDiv = document.getElementById('setMakerDiv');
    function validateRequirements() {
        let allValid = true;
        const textInputs = setMakerDiv.querySelectorAll('input[type="text"]');
        textInputs.forEach((input) => {
            if (!input.value.trim()) allValid = false;
        });
        const textareas = setMakerDiv.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            if (!textarea.value.trim()) allValid = false;
        });
        const childFields = document.querySelectorAll('.childField');
        childFields.forEach((field, index) => {
            const selectedType = field.querySelector(`input[name="childType-${index}"]:checked`);
            if (!selectedType) allValid = false;
            if (selectedType && selectedType.value === 'output') {
                const outputType = field.querySelector(`input[name="outputType-${index}"]:checked`);
                if (!outputType) allValid = false;
            }
            if (selectedType && selectedType.value === 'parent') {
                const grandchildFields = field.querySelectorAll(`.grandchildField-${index}`);
                grandchildFields.forEach((grandchildField, grandchildIndex) => {
                    const grandchildText = grandchildField.querySelector(`#grandchildText-${index}-${grandchildIndex}`);
                    const grandchildOutput = grandchildField.querySelector(`#grandchildOutput-${index}-${grandchildIndex}`);
                    const grandchildOutputType = field.querySelector(`input[name="outputType-${index}-${grandchildIndex}"]:checked`);
                if (!grandchildOutputType) allValid = false;
                    if (!grandchildText || !grandchildText.value.trim()) allValid = false;
                    if (!grandchildOutput || !grandchildOutput.value.trim()) allValid = false;
                });
            }
        });
        saveConfigButton.disabled = !allValid;
    }

    function inputListener() {
        validateRequirements();
    }
    
    function clickListener(event) {
        if (event.target.closest('.childField')) {
            validateRequirements();
        }
    }
    setMakerDiv.addEventListener('input', inputListener);
    document.body.addEventListener('click', clickListener);
    return () => {
        setMakerDiv.removeEventListener('input', inputListener);
        document.body.removeEventListener('click', clickListener);
    };
}

let removeValidationListeners = null;
function enableValidation() {
    if (!removeValidationListeners) {
        removeValidationListeners = startValidationListeners();
    }
}

function disableValidation() {
    if (removeValidationListeners) {
        removeValidationListeners();
        removeValidationListeners = null;
    }
}

function parsePx(value) {
    if (!value || typeof value !== 'string') {
        return undefined;
    }
    return parseInt(value.replace('px', ''), 10) || 0;
}

function arrangeHierarchy(grandfatherId) {
    const gfElement = document.getElementById(grandfatherId);
    const grandfatherMaster = gfElement instanceof HTMLElement ? window.getComputedStyle(gfElement) : null;
    const grandfatherTop = profileManager.getAttribute(grandfatherId, 'top') !== undefined ? parsePx(profileManager.getAttribute(grandfatherId, 'top')) : grandfatherMaster ? parsePx(grandfatherMaster.top) : 0;
    const grandfatherLeft = profileManager.getAttribute(grandfatherId, 'left') !== undefined ? parsePx(profileManager.getAttribute(grandfatherId, 'left')) : grandfatherMaster ? parsePx(grandfatherMaster.left) : 0;
    const grandfatherWidth = profileManager.getAttribute(grandfatherId, 'width') !== undefined ? parsePx(profileManager.getAttribute(grandfatherId, 'width')) : grandfatherMaster ? parsePx(grandfatherMaster.width) : 110;
    const grandfatherHeight = profileManager.getAttribute(grandfatherId, 'height') !== undefined ? parsePx(profileManager.getAttribute(grandfatherId, 'height')) : grandfatherMaster ? parsePx(grandfatherMaster.height) : 50;
    if (
        isNaN(grandfatherTop) ||
        isNaN(grandfatherLeft) ||
        isNaN(grandfatherWidth) ||
        isNaN(grandfatherHeight)
    ) { return; }
    const grandfatherCenterX = grandfatherLeft + grandfatherWidth / 2;
    const grandfatherCenterY = grandfatherTop + grandfatherHeight / 2;
    function positionButtons(parentId, parentCenterX, parentCenterY) {
        const childrenIds = profileManager.getAttribute(parentId, 'children');
        if (!childrenIds || !Array.isArray(childrenIds) || childrenIds.length === 0) {
            return;
        }
        const childCount = childrenIds.length;
        if (childCount === 2) {
            const childOneId = childrenIds[0];
            const childTwoId = childrenIds[1];
            const c1Element = document.getElementById(childOneId);
            const childOneWidth = profileManager.getAttribute(childOneId, 'width') !== undefined ? parsePx(profileManager.getAttribute(childOneId, 'width')) : c1Element ? parsePx(window.getComputedStyle(c1Element).width) : 110;
            const childOneLeft = parentCenterX - childOneWidth - 5;
            const childTwoLeft = parentCenterX + 5;
            profileManager.setAttribute(childOneId, 'top', `${grandfatherTop}px`);
            profileManager.setAttribute(childOneId, 'left', `${childOneLeft}px`);
            profileManager.setAttribute(childTwoId, 'top', `${grandfatherTop}px`);
            profileManager.setAttribute(childTwoId, 'left', `${childTwoLeft}px`);
        } else if (childCount === 3) {
            const childOneId = childrenIds[0];
            const childTwoId = childrenIds[1];
            const childThreeId = childrenIds[2];
            const c1Element = document.getElementById(childOneId);
            const c3Element = document.getElementById(childThreeId);
            const childOneWidth = profileManager.getAttribute(childOneId, 'width') !== undefined ? parsePx(profileManager.getAttribute(childOneId, 'width')) : c1Element instanceof HTMLElement ? parsePx(window.getComputedStyle(c1Element).width) : 110;
            const childThreeWidth = profileManager.getAttribute(childThreeId, 'width') !== undefined ? parsePx(profileManager.getAttribute(childThreeId, 'width')) : c3Element instanceof HTMLElement ? parsePx(window.getComputedStyle(c3Element).width) : 110;
            const childOneLeft = grandfatherLeft - childOneWidth - 10;
            const childThreeLeft = grandfatherLeft + grandfatherWidth + 10;
            profileManager.setAttribute(childOneId, 'top', `${grandfatherTop}px`);
            profileManager.setAttribute(childOneId, 'left', `${childOneLeft}px`);
            profileManager.setAttribute(childTwoId, 'top', `${grandfatherTop}px`);
            profileManager.setAttribute(childTwoId, 'left', `${grandfatherLeft}px`);
            profileManager.setAttribute(childThreeId, 'top', `${grandfatherTop}px`);
            profileManager.setAttribute(childThreeId, 'left', `${childThreeLeft}px`);
        } else if (childCount === 4) {
            const childOneId = childrenIds[0];
            const childTwoId = childrenIds[1];
            const childThreeId = childrenIds[2];
            const childFourId = childrenIds[3];
            const c1Element = document.getElementById(childOneId);
            const c3Element = document.getElementById(childThreeId);
            const childOneWidth = profileManager.getAttribute(childOneId, 'width') !== undefined ? parsePx(profileManager.getAttribute(childOneId, 'width')) : c1Element instanceof HTMLElement ? parsePx(window.getComputedStyle(c1Element).width) : 110;
            const childThreeWidth = profileManager.getAttribute(childThreeId, 'width') !== undefined ? parsePx(profileManager.getAttribute(childThreeId, 'width')) : c3Element instanceof HTMLElement ? parsePx(window.getComputedStyle(c3Element).width) : 110;
            const childOneHeight = profileManager.getAttribute(childOneId, 'height') !== undefined ? parsePx(profileManager.getAttribute(childOneId, 'height')) : c1Element instanceof HTMLElement ? parsePx(window.getComputedStyle(c1Element).height) : 50;
            const childThreeHeight = profileManager.getAttribute(childThreeId, 'height') !== undefined ? parsePx(profileManager.getAttribute(childThreeId, 'height')) : c3Element instanceof HTMLElement ? parsePx(window.getComputedStyle(c3Element).height) : 50;
            const childOneLeft = parentCenterX - childOneWidth - 5;
            const childThreeLeft = parentCenterX - childThreeWidth - 5;
            const childTwoLeft = parentCenterX + 5;
            const childFourLeft = parentCenterX + 5;
            const childOneTop = parentCenterY - childOneHeight - 5;
            const childTwoTop = parentCenterY - childThreeHeight - 5;
            const childThreeTop = parentCenterY + 5;
            const childFourTop = parentCenterY + 5;
            profileManager.setAttribute(childOneId, 'top', `${childOneTop}px`);
            profileManager.setAttribute(childOneId, 'left', `${childOneLeft}px`);
            profileManager.setAttribute(childTwoId, 'top', `${childTwoTop}px`);
            profileManager.setAttribute(childTwoId, 'left', `${childTwoLeft}px`);
            profileManager.setAttribute(childThreeId, 'top', `${childThreeTop}px`);
            profileManager.setAttribute(childThreeId, 'left', `${childThreeLeft}px`);
            profileManager.setAttribute(childFourId, 'top', `${childFourTop}px`);
            profileManager.setAttribute(childFourId, 'left', `${childFourLeft}px`);
        } else {
            return;
        }
        childrenIds.forEach((childId) => {
            positionButtons(childId, grandfatherCenterX, grandfatherCenterY);
        });
    }
    positionButtons(grandfatherId, grandfatherCenterX, grandfatherCenterY);
}

function setCustomListeners(elementId) {
	const idList = [elementId];
	const children = profileManager.getAttribute(elementId, 'children') || [];
	children.forEach((childId) => {
		idList.push(childId);
		const isParent = profileManager.getAttribute(childId, 'isParent');
		if (isParent) {
			const grandchildren = profileManager.getAttribute(childId, 'children') || [];
			idList.push(...grandchildren);
		}
	});
	idList.forEach((id) => {
		const isParent = profileManager.getAttribute(id, 'isParent');
		const type = profileManager.getAttribute(id, 'type');
		const element = document.getElementById(id);
		if (!element) {
            return;
        }
		if (isParent) {
            console.log('isParent', isParent);
			element.addEventListener('click', () => {
				if (element.classList.contains('snap')) {
                    return;
                }
				const children = profileManager.getAttribute(id, 'children') || [];
				children.forEach((childId) => {
					profileManager.setAttribute(childId, 'display', 'block');
				});
				const parentId = profileManager.getAttribute(id, 'parentId');
				if (parentId) {
					const siblings = profileManager.getAttribute(parentId, 'children') || [];
					siblings.forEach((siblingId) => {
						profileManager.setAttribute(siblingId, 'display', 'none');
					});
				}
				if (!parentId) {
					profileManager.setAttribute(id, 'display', 'none');
				}
                profileManager.setConsoleUsingProfile();
			});
		}
		if (type === 'clip' || type === 'solo') {
			element.addEventListener('click', () => {
				if (element.classList.contains('snap')) return;
				outputText(id);
				const firstParent = profileManager.getAttribute(id, 'parentId');
				const secondParent = profileManager.getAttribute(firstParent, 'parentId');
				const topParent = secondParent || firstParent;
				profileManager.setAttribute(topParent, 'display', 'block');
				hideAllDescendants(topParent);
                profileManager.setConsoleUsingProfile();
			});
		}
	});
	function hideAllDescendants(buttonId) {
		const children = profileManager.getAttribute(buttonId, 'children') || [];
		if (!Array.isArray(children)) return;
		children.forEach((childId) => {
			profileManager.setAttribute(childId, 'display', 'none');
			hideAllDescendants(childId);
		});
        profileManager.setConsoleUsingProfile();
	}
}

// Custom Buttons
document.getElementById("infoDone")?.addEventListener("click", createButton);
document.getElementById("infoCancel")?.addEventListener("click", buttonCancel);

function newButton(selectedClass) {
	document.getElementById("infoOverlay").classList.add("show");

	const elements = document.querySelectorAll(`.${selectedClass}`);
	elements.forEach((el) => {
		el.style.display = 'block';
	});

	if (selectedClass === 'popNoteSelection') {
		document.getElementById('pop').checked = true;
		const infoDiv = document.getElementById('infoDiv');
		const header = infoDiv.querySelector('.h2');
		header.style.display = 'none';
	}
}

function buttonCancel() {
	document.getElementById('solo').checked = false;
	document.getElementById('clip').checked = false;
	document.getElementById('pop').checked = false;
	document.getElementById('BtnDisplay').value = '';
	document.getElementById('BtnContent').value = '';
	document.getElementById("infoOverlay").classList.remove("show");
	const popNoteElems = document.querySelectorAll('.popNoteSelection');
	popNoteElems.forEach((el) => {
		el.style.display = 'none';
	});
	const basicElems = document.querySelectorAll('.basicSelection');
	basicElems.forEach((el) => {
		el.style.display = 'none';
	});
	const infoDiv = document.getElementById('infoDiv');
	const header = infoDiv.querySelector('.h2');
	header.style.display = 'block';
}

function createButton() {
	const selectedButtonType = document.querySelector('input[name="buttonType"]:checked');
	if (!selectedButtonType) {
		showModalMessage('Please select a button type.');
		return;
	}
	const buttonType = selectedButtonType.id;
	const btnDisplay = sanitizeInput(document.getElementById("BtnDisplay").value.trim());
	const btnContent = sanitizeInput(document.getElementById("BtnContent").value.trim());
	if (btnDisplay === '' || btnContent === '') {
		showModalMessage('Both "Button Display" and "Note Content" fields must be filled out.');
	}
	const timestamp = new Date().getTime().toString();
	const buttonId = timestamp.slice(-5) + 'cust';
	const classes = ['D', 'R', 'P', 'C', 'X', 'A', 'mainButton'];
	profileManager.setAttribute(buttonId, 'type', buttonType);
	profileManager.setAttribute(buttonId, 'display', 'block');
	profileManager.setAttribute(buttonId, 'height', '50px');
	profileManager.setAttribute(buttonId, 'width', '110px');
	const coordinates = setPosition();
	profileManager.setAttribute(buttonId, 'top', coordinates[1]);
	profileManager.setAttribute(buttonId, 'left', coordinates[0]);
	profileManager.setAttribute(buttonId, 'innerText', btnDisplay);
	profileManager.setAttribute(buttonId, 'output', btnContent);
	profileManager.setAttribute(buttonId, 'classes', classes);
	profileManager.saveToLocalStorage();
	profileManager.createButtonElement(buttonId);
	buttonCancel();
}

function conjunctionJunction(buttonId) {
	const funct = profileManager.getAttribute(buttonId, 'type');
	const note = profileManager.getAttribute(buttonId, 'output');
	if ((funct === 'clip' || funct === 'solo') && !note) {
		showModalMessage("No output currently defined");
		return;
	}
	document.getElementById("EDITarea").value = note;
	switch (funct) {
		case "pop":
			let popDivId = profileManager.getAttribute(buttonId, 'popDiv');
			let popDiv = popDivId ? document.getElementById(popDivId) : null;
			if (popDiv) {
				if (popDiv.classList.contains('show')) {
					popDiv.classList.remove('show');
				} else {
					popDiv.innerText = note;
					popDiv.classList.add('show');
					enforceAspectRatioById(popDivId);
					setPopDivPos(buttonId, popDivId);
				}
			} else {
				popDiv = document.createElement('div');
				popDiv.innerText = note || "No content available";
				popDiv.classList.add('popDivClass', 'show', 'R', 'mainDiv');
				const timestamp = new Date().getTime().toString();
				popDivId = timestamp.slice(-5) + 'popDiv';
				popDiv.id = popDivId;
				profileManager.setAttribute(buttonId, 'popDiv', popDivId);
				document.body.appendChild(popDiv);
                enforceAspectRatioById(popDivId);
				setPopDivPos(buttonId, popDivId);
			}
			break;
		case "clip":
			const note2 = note + '\n';
			copy(note2);
			break;
		case "solo":
			document.getElementById("textarea2").value += note;
			document.getElementById("textarea2").value += "\n\n";
			break;
    }
}

function enforceAspectRatioById(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        showModalMessage(`Element with ID "${elementId}" not found.`);
        return;
    }
    let width = element.clientWidth;
    let height = element.clientHeight;
    let aspectRatio = width / height;
    if (aspectRatio > 4) {
		height = width / 4
    }
    if (aspectRatio < 0.5) {
		width = height / 2
    }
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    const padStyle = Math.min(width / 10, 25);
    element.style.padding = `${padStyle}px`;
}

function sanitizeInput(value) {
	const tempDiv = document.createElement("div");
	tempDiv.textContent = value;
	return tempDiv.innerHTML;
}

function parsePxNB(value) {
    if (!value || typeof value !== 'string') {
        return undefined;
    }
    return parseInt(value.replace('px', ''), 10) || 0;
}

function getElementDimensions(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return null;
    const computed = window.getComputedStyle(element);
    return {
        left: parsePxNB(computed.left),
        top: parsePxNB(computed.top),
        width: parsePxNB(computed.width),
        height: parsePxNB(computed.height)
    };
}

function setPopDivPos(buttonId, popDivId) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const button = getElementDimensions(buttonId);
    const popDiv = getElementDimensions(popDivId);
    if (!button || !popDiv) {
        showModalMessage("Invalid button or popDiv element.");
        return null;
    }
    const margin = 10;
    const spacing = 10;
    let newLeft = button.left + button.width / 2 - popDiv.width / 2;
    let newTop = button.top - spacing - popDiv.height;
    if (newLeft < margin) {
        newLeft = margin;
    } else if (newLeft + popDiv.width > viewportWidth - margin) {
        newLeft = viewportWidth - popDiv.width - margin;
    }
    if (newTop < margin) {
        newTop = button.top + button.height + spacing;
        if (newTop + popDiv.height > viewportHeight - margin) {
            newTop = viewportHeight - popDiv.height - margin;
        }
    }
	const element = document.getElementById(popDivId);
	element.style.top = `${newTop}px`;
	element.style.left = `${newLeft}px`;
}

const countSel = document.getElementById('customSlideCount');
const childWrap = document.querySelector('.customSlideChilds');

function getCount(){
	const v=parseInt(countSel.value,10) || 0;
	const t = parseInt(countSel.selectedOptions[0]?.textContent.trim(), 10) || 0;
	const n = Math.max(v, t, 2);
	return n;
}

function makeSlide(i){
	const d = document.createElement('div');
	d.className = 'sliders';
	d.dataset.dyn = '1';
	d.innerHTML =
		`<label for="customSlideText${i}">Slide ${i}</label>
		<input type="text" id="customSlideText${i}" placeholder="Display Text">
		<textarea id="customSlideOutput${i}" placeholder="Output"></textarea>
		<div class="buttonOutputType">
			<button id="customSlideOutput${i}clip" class="typeClass" name="customSlideOutput${i}type">Clip</button>
			<span>Type</span>
			<button id="customSlideOutput${i}solo" class="typeClass" name="customSlideOutput${i}type">Solo</button>
		</div>`;
	return d;
}

function getVals(){
	const m = new Map()
	childWrap.querySelectorAll('.sliders[data-dyn="1"]').forEach( n => {
		const ti = n.querySelector('input[id^="customSlideText"]');
		const ta = n.querySelector('textarea[id^="customSlideOutput"]');
		const i = ti?parseInt(ti.id.replace('customSlideText',''), 10) : 0;
		if(i >= 3) m.set(i,{t:ti.value,o:ta.value})
	})
	return m;
}

function syncSlides(){
	const need=getCount();
	const keep=2;
	const saved=getVals();
	childWrap.querySelectorAll('.sliders[data-dyn="1"]').forEach(n=>n.remove());
	const frag=document.createDocumentFragment();
	for(let i=3;i<=need;i++){
		const row=makeSlide(i);
		if(saved.has(i)){
			const v=saved.get(i);
			row.querySelector(`#customSlideText${i}`).value=v.t;
			row.querySelector(`#customSlideOutput${i}`).value=v.o;
		}
		frag.appendChild(row);
	}
	childWrap.appendChild(frag);
}

countSel.addEventListener('change',syncSlides);
countSel.addEventListener('input',syncSlides);
syncSlides();



const slideMakerOuter = document.getElementById('slideMakerOuter');
function startSlideMaker() {
	document.getElementById('slideMakerOuter').classList.add('show');
    document.getElementById('slideMakerOuter').querySelectorAll(".typeClass").forEach(button => {
        button.addEventListener("click", handleTypeClass);
    });
}

document.getElementById("slideMakerRun")?.addEventListener('click', getSlideMakerData);
function getSlideMakerData() {
    if (!validateSlideInputsAndButtons()) {
        showModalMessage('Fill out all inputs and select an output type');
        return;
    }
    const slideMakerDiv = document.getElementById("slideMakerDiv");
    const mainButtonText = slideMakerDiv.querySelector("#customSlideText").value.trim();
    const timestamp = new Date().getTime().toString();
    const buttonId = "slide_" + timestamp.slice(-5);
    const buttonData = [];
    buttonData.push({
        id: buttonId,
        container: `${buttonId}_container`,
        btnContainer: `${buttonId}_btns`,
        innerText: mainButtonText,
        children: [],
        type: "slide",
        display: "block",
        width: "110px",
        height: "45px",
        top: "200px",
        left: "380px",
        fontSize: "17px",
        classes: ["D", "R", "P", "C", "X", "A", "S", "mainButton"]
    });
    const childContainers = slideMakerDiv.querySelectorAll(".customSlideChilds > div");
    childContainers.forEach((childDiv, index) => {
        const displayText = childDiv.querySelector("input").value.trim();
        const outputText = childDiv.querySelector("textarea").value.trim();
        const selectedButton = childDiv.querySelector(".useClassType");
        const buttonType = selectedButton.id.slice(-4).toLowerCase();
        const childId = `${buttonId}_${index + 1}`;
        const btnTop = index * 100;
        const childButton = {
            id: childId,
            container: `${buttonId}_container`,
            btnContainer: `${buttonId}_btns`,
            innerText: displayText,
            output: outputText,
            type: buttonType,
            display: "block",
            width: "110px",
            height: "45px",
            fontSize: "17px",
            left: "530px",
            top: `${btnTop}px`,
            classes: ["D", "R", "P", "C", "X", "A", "S", "mainButton"]
        };
        buttonData.push(childButton);
        buttonData[0].children.push(childId);
    });
    closeSlideMaker();
    console.log(buttonData);
    handleButtonCreate(buttonData);
}

function custSlideCounter() {
    let count = 0;
    document.querySelectorAll('.S').forEach(element => {
        const type = profileManager.getAttribute(element.id, 'type');
        if (type === 'slide') count++;
    });
    return count;
}

document.getElementById('slideMakerCancel').addEventListener("click", closeSlideMaker);
function closeSlideMaker() {
    slideMakerOuter.querySelectorAll(".typeClass").forEach(button => {
		button.classList.remove("useClassType");
		button.removeEventListener("click", handleTypeClass);
	});
    slideMakerOuter.querySelectorAll("input, textarea").forEach(element => {
        element.value = "";
    });
    slideMakerOuter.classList.remove('show');
}

function validateSlideInputsAndButtons() {
    let allValid = true;
    const hasPlaceholderShown = slideMakerOuter.querySelectorAll("input:placeholder-shown, textarea:placeholder-shown").length > 0;
    if (hasPlaceholderShown) {
        allValid = false;
    }
    const slideTypeDivs = slideMakerOuter.querySelectorAll(".buttonOutputType");
    for (const div of slideTypeDivs) {
        const selectedButtons = div.querySelectorAll(".useClassType");
        if (selectedButtons.length !== 1) {
            allValid = false;
            break;
        }
    }
    return allValid;
}

function toggleButtonClass(addEl, removeEl) {
    if (!document.getElementById(addEl).classList.contains("useClassType"))
        document.getElementById(addEl).classList.add("useClassType");
    if (document.getElementById(removeEl).classList.contains("useClassType"))
        document.getElementById(removeEl).classList.remove("useClassType");
}

function handleTypeClass(event) {
    const buttonId = event.target.id;
    const baseId = buttonId.slice(0, -4);
    const alternateSuffix = buttonId.endsWith("clip") ? "solo" : "clip";
    const pairedButtonId = baseId + alternateSuffix;
    toggleButtonClass(buttonId, pairedButtonId);
}

function handleButtonCreate(buttonData) {
    if (!Array.isArray(buttonData) || buttonData.length === 0) {
        console.error("Invalid button data passed to handleButtonCreate.");
        return;
    }
    const attributes = ["type", "display", "height", "width", "top", "left", "innerText", "output", "classes", "container", "fontSize", "btnContainer"];
    buttonData.forEach(button => {
        attributes.forEach(attr => {
            if (button[attr] !== undefined) {
                profileManager.setAttribute(button.id, attr, button[attr]);
            }
        });
    });
    buttonData.forEach(button => {
        profileManager.createButtonElement(button.id);
    });
}

function processSlide(element) {
    const containerId = profileManager.getAttribute(element.id, 'container');
    const btnContainerId = profileManager.getAttribute(element.id, 'btnContainer');
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.classList.add('blockAbsolute');
        const btnContainer = document.createElement('div');
        btnContainer.id = btnContainerId;
        btnContainer.classList.add('collectionInner', 'hideit');
        container.appendChild(btnContainer);
        document.body.appendChild(container);
    }
    const type = profileManager.getAttribute(element.id, 'type');
    if (type === 'slide') {
        container.insertBefore(element, document.getElementById(btnContainerId));
        document.getElementById(element.id).addEventListener('click', function () {
            if (document.getElementById(element.id).classList.contains('snap')) return;
            showCollection(element.id);
        });
    } else {
        document.getElementById(btnContainerId).appendChild(element);
        element.addEventListener('click', function () {
            conjunctionJunction(element.id);
        });
        element.addEventListener('click', function () {
            if (btns_timeout) {
                clearTimeout(btns_timeout);
            }
            closeSlide();
        });
    }
}