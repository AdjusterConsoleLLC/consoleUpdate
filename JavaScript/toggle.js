function showTogglesFunct() {
    if (!document.getElementById("toggleSwitchesHeader").classList.contains('show')) {
        openToggle();
    } else {
        closeToggle();
    }
}

function openToggle() {
    createToggleSwitches();
    document.getElementById('toggleSwitchesHeader').classList.add("show");
}

function closeToggle() {
    document.getElementById('toggleSwitchesHeader').classList.remove("show");
}

function createToggleSwitches() {
    const elements = document.querySelectorAll('.A');
    const toggleSwitchesContainer = document.getElementById('toggleSwitches');
    const toggleSwitchesHeader = document.getElementById('toggleSwitchesHeader');
    toggleSwitchesContainer.innerHTML = '';
    const closeToggleBtn = document.createElement('a');
    closeToggleBtn.href = '#';
    closeToggleBtn.innerHTML = '&times;';
    closeToggleBtn.id = 'closeToggleBtn';
    closeToggleBtn.style.position = 'absolute';
    closeToggleBtn.style.display = 'block';
    closeToggleBtn.style.top = '20px';
    closeToggleBtn.style.right = '10px';
    closeToggleBtn.style.color = 'red';
    closeToggleBtn.style.fontSize = '22px';
    closeToggleBtn.style.textDecoration = 'none';
    closeToggleBtn.addEventListener('click', closeToggle);
    toggleSwitchesHeader.appendChild(closeToggleBtn);
    const profile = profileManager.getCurrentProfileData();
    elements.forEach((element) => {
        if (!profile[element.id]) {
            profile[element.id] = {};
        }
        if (!profile[element.id].display) {
            profile[element.id].display = {};
        }
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'toggle';
        const label = document.createElement('label');
        label.className = 'berth';
        const spanOuter = document.createElement('span');
        spanOuter.className = 'switch';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = profile[element.id].display === "block" ? true : false;
        checkbox.setAttribute('data-element-id', element.id);
        checkbox.addEventListener('change', () => {
            element.style.display = checkbox.checked ? 'block' : 'none';
            profile[element.id].display = element.style.display;
            profileManager.saveToLocalStorage();
        });
        const span = document.createElement('span');
        span.className = 'slider round';
        const paragraph = document.createElement('p');
        if (element.id === 'phoneNumbers') {
            paragraph.innerText = 'Phone Numbers';
        } else if (element.id === 'estimateIntake') {
            paragraph.innerText = 'Estimate Intake';
        } else if (element.id === 'textarea2') {
            paragraph.innerText = 'Main Text Editor';
        } else if (element.id === 'areaOne') {
            paragraph.innerText = 'Upper Text Editor';
        } else if (element.id.includes('userTextarea')) {
            paragraph.innerText = element.id;
        } else {
            let lines = element.innerText.split('\n');
            let index = 0;
            while (index < lines.length && lines[index].trim() === '') {
                index++;
            }
            paragraph.innerText = lines[index];
        }
        spanOuter.appendChild(checkbox);
        spanOuter.appendChild(span);
        label.appendChild(spanOuter);
        label.appendChild(paragraph);
        toggleDiv.appendChild(label);
        toggleSwitchesContainer.appendChild(toggleDiv);
        setToggleSwitches();
    });
}

function setToggleSwitches() {
    const profile = profileManager.getCurrentProfileData();
    if (!profile) return;
    Object.keys(profile).forEach(elementId => {
        const elementSettings = profile[elementId];
        if ('display' in elementSettings) {
            const displayValue = elementSettings.display;
            const checkbox = document.querySelector(`#toggleSwitches .toggle label.switch input[type="checkbox"][data-element-id="${elementId}"]`);
            if (checkbox) {
                checkbox.checked = (displayValue === 'inline-block' || displayValue === 'block');
            }
        }
    });
    document.querySelectorAll('.A').forEach(element => {
        const checkbox = document.querySelector(`#toggleSwitches .toggle label.switch input[type="checkbox"][data-element-id="${element.id}"]`);
        if (checkbox) {
            if (document.body.contains(element)) {
                const computedDisplay = window.getComputedStyle(element).display;
                checkbox.checked = (computedDisplay === 'inline-block' || computedDisplay === 'block');
            } else {
                checkbox.checked = false;
            }
        }
    });
}

function setToggleSwitches1() {
    const profile = profileManager.getCurrentProfileData();
    if (!profile) {
        return;
    }
    Object.keys(profile).forEach((elementId) => {
        const elementSettings = profile[elementId];
        if ('display' in elementSettings) {
            const displayValue = elementSettings.display;
            const checkbox = document.querySelector(`#toggleSwitches .toggle label.switch input[type="checkbox"][data-element-id="${elementId}"]`);
            if (checkbox) {
                if (displayValue === 'inline-block') {
                    checkbox.checked = true;
                } else if (displayValue === 'none') {
                    checkbox.checked = false;
                }
            }
        }
    });
    const elements = document.querySelectorAll('.A');
    elements.forEach((element) => {
        const computedDisplay = window.getComputedStyle(element).display;
        const checkbox = document.querySelector(`#toggleSwitches .toggle label.switch input[type="checkbox"][data-element-id="${element.id}"]`);
        if (checkbox) {
            if (computedDisplay === 'inline-block') {
                checkbox.checked = true;
            } else if (computedDisplay === 'none') {
                checkbox.checked = false;
            }
        }
    });
}

function setToggleAndShadow() {
	const toggleSwitchesHeader = document.getElementById("toggleSwitchesHeader");
	const shadowToggle = document.getElementById("shadowToggle");
	toggleSwitchesHeader.style.top = "260px";
	toggleSwitchesHeader.style.left = "284px";
	shadowToggle.style.top = "260px";
	shadowToggle.style.left = "284px";
	profileManager.setAttribute('toggleSwitchesHeader', 'top', '530px');
	profileManager.setAttribute('toggleSwitchesHeader', 'left', '30px');
	profileManager.setAttribute('shadowToggle', 'top', '530px');
	profileManager.setAttribute('shadowToggle', 'left', '30px');
}