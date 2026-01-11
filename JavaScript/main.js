let profileManager;
window.onload = function PutItBack() {
	if (!profileManager) {
		profileManager = new ProfileManager();
	}
	loadProfileManager();
	populateProfileDropdown();
	resetColors();
	// startUp();
	setUpSets();
	welcomeSplash();
};

function applyScale() {
	const baseWidth = 958;
	const baseHeight = 910;
	const scaleW = window.innerWidth / baseWidth;
	const scaleH = window.innerHeight / baseHeight;
	const scale = Math.min(scaleW, scaleH, 1);

	document.body.style.transform = `scale(${scale})`;
	document.body.style.transformOrigin = 'top left';
	document.body.style.width = `${baseWidth}px`;
	document.body.style.height = `${baseHeight}px`;
}

window.addEventListener('DOMContentLoaded', applyScale);
window.addEventListener('resize', applyScale);

function welcomeSplash() {
	const isReturning = localStorage.getItem('isReturning') === 'true';
	if (isReturning) {
		return;
	} else {
		localStorage.setItem('isReturning', 'true');
	}
}

function startUp() {
	const skip = localStorage.getItem('skipSplash');
	if (skip === 'true') {
		const loadingDiv = document.createElement('div');
		loadingDiv.textContent = 'Loading...';
		loadingDiv.classList.add('loading-text');
		splashContainer.appendChild(loadingDiv);
		splashScreen(true);
	} else {
		splashScreen(false); 
	}
	const agreed = localStorage.getItem('agreed');
	if (agreed !== 'agreed') {
		showDisclaimer();
	}
}

function setUpSets() {
	const isSetUp = localStorage.getItem('setUp') === 'true';
	if (isSetUp) return;
	arrangeHierarchy('s001');
	arrangeHierarchy('s002');
	profileManager.setConsoleUsingProfile();
	localStorage.setItem('setUp', 'true');
}

function showDisclaimer() {
	document.getElementById('disclaimer2').style.display = "inline-block";
}

function hideDisclaimer(x) {
	let agreed = localStorage.getItem('agreed');
	if (x === 'y' && agreed !== 'agreed') return;
	if (x === 'x') localStorage.setItem('agreed', 'agreed');
	document.getElementById('disclaimer2').style.display = "none";
}

function splashScreen(skip) {
	const splashContainer = document.getElementById('splashContainer');
	if (!skip) {
		setTimeout(function () {
			splashContainer.classList.add("exit-effect");	 
		}, 1000);
			splashContainer.addEventListener('animationend', function () {
			splashContainer.classList.add("hidden");
		});
	} else {
		setTimeout(function () {
			splashContainer.classList.add("exit-fast");	 
		}, 200);
			splashContainer.addEventListener('animationend', function () {
			splashContainer.classList.add("hidden");
		});
	}
	localStorage.setItem('skipSplash', 'false');
};

function MENU(event) {
    event.preventDefault();
	event.stopPropagation();
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        document.addEventListener('click', closeMenu);
    } else {
        document.removeEventListener('click', closeMenu);
    }
	if (document.querySelector('.profileDropdown').classList.contains('show')) document.querySelector('.profileDropdown').classList.remove('show');
	toggleMenuOff();
}

function closeMenu() {
    document.querySelector('.dropdown').classList.remove('show');
    document.removeEventListener('click', closeMenu);
}

function outputText(btnID, typeSent) {
    if (document.getElementById(btnID).classList.contains('snap')) return;
	let defaultText;
    if (defaultValues[btnID] && defaultValues[btnID].output) {
			defaultText = defaultValues[btnID].output || "";
	}
    const savedText = profileManager.getAttribute(btnID, 'output');
	const type = profileManager.getAttribute(btnID, 'type') || typeSent || 'clip';
    const textToUse = savedText || defaultText;
    const textarea2 = document.getElementById("textarea2");
    if (type === 'solo') {
        if (btnID === 'p003') removeLine();
        textarea2.value += textToUse;
        textarea2.scrollTop = textarea2.scrollHeight;
    } else if (type === 'clip') {
        copy(textToUse);
    }
    profileManager.setAttribute(btnID, 'output', textToUse);
    profileManager.saveToLocalStorage();
}

function COPYNOTE() {
	const outputString = document.getElementById("textarea2").value;
	copy(outputString);
}

function removeLine() {
	let textareaVal = document.getElementById("textarea2").value;
	textareaVal = textareaVal.slice(0, -1);
	document.getElementById("textarea2").value = textareaVal;
}

function openDiv(divId, className = 'open', option = false) {
    const div = document.getElementById(divId);
    if (!div) {
        return;
    }
    div.classList.add(className);
    if (option) {
        const closeOnClick = () => {
            div.classList.remove(className);
            document.removeEventListener('click', closeOnClick);
        };
        setTimeout(() => {
            document.addEventListener('click', closeOnClick);
        }, 0);
    }
}

function CopyIntakeForm(index) {
    const editableDiv = document.getElementById('textarea1');
    const lines = editableDiv.innerText.split('\n');
    const lineIndex = parseInt(index);
    if (lineIndex < 0 || lineIndex >= lines.length) return;
    let selectedText = lines[lineIndex].trim();
    selectedText = selectedText.replace(/^PAYMENT:\s*/, '')
                               .replace(/^ZIPCODE:\s*/, '')
                               .replace(/^MILEAGE:\s*/, '');
    copy(selectedText.trim());
}