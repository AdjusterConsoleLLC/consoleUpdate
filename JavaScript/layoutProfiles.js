class ProfileManager {
    constructor() {
        this.profiles = JSON.parse(localStorage.getItem('profiles')) || {};
        this.currentProfile = localStorage.getItem('currentProfile') || null;
    }

    saveToLocalStorage() {
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
        localStorage.setItem('currentProfile', this.currentProfile);
    }
	
    addProfile(profileName) {
        if (this.profiles[profileName]) {
			showModalMessage('Profile name already exists.');
			return;
		}
		this.profiles[profileName] = defaultProfileInit();
        this.currentProfile = profileName;
		this.saveToLocalStorage();
		this.setConsoleUsingProfile(profileName);
		refreshElements();
    }

    renameProfile(oldName, newName) {
        if (!this.profiles[oldName]) {
            showModalMessage('Profile does not exist.');
			return;
        }
        if (this.profiles[newName]) {
            showModalMessage('New profile name already exists.');
			return;
        }
        this.profiles[newName] = this.profiles[oldName];
        delete this.profiles[oldName];
        if (this.currentProfile === oldName) {
            this.currentProfile = newName;
        }
        this.saveToLocalStorage();
    }

    deleteProfile(profileName) {
        if (!this.profiles[profileName]) {
            showModalMessage('Profile does not exist.');
			return;
        }
        delete this.profiles[profileName];
		this.saveToLocalStorage();
    }
	
	resetProfile(profileName) {
        if (!this.profiles[profileName]) {
            showModalMessage('Profile does not exist.');
			return;
        }
		this.profiles[profileName] = defaultProfileInit();
		this.setConsoleUsingProfile(profileName);
		this.saveToLocalStorage();
		refreshElements();
    }

    changeProfile(profileName) {
        if (!this.profiles[profileName]) {
            showModalMessage('Profile does not exist.');
			return;
		}
        this.currentProfile = profileName;
		this.saveToLocalStorage();
        this.setConsoleUsingProfile(profileName);
		refreshElements();
    }
	
	cloneProfile(originalProfile, newProfileName) {
		if (this.profiles[newProfileName]) {
			showModalMessage('A profile with this name already exists.');
			return;
		}
		if (!this.profiles[originalProfile]) {
			showModalMessage('The original profile does not exist.');
			return;
		}
		this.profiles[newProfileName] = JSON.parse(JSON.stringify(this.profiles[originalProfile]));
		this.saveToLocalStorage();
	}

    getCurrentProfileData() {
        if (!this.currentProfile) {
            showModalMessage('No profile is currently active.');
			return;
        }
        return this.profiles[this.currentProfile];
    }
	
	setAttribute(elementId, attribute, value) {
		if (!this.currentProfile) {
            showModalMessage('No profile is currently active.');
			return;
        }
		const profile = this.getCurrentProfileData();
		if (!profile[elementId]) {
            profile[elementId] = {};
        }
		if (!profile[elementId][attribute]) {
            profile[elementId][attribute] = {};
        }
		profile[elementId][attribute] = value;
        this.saveToLocalStorage();
	}
	
    getAttribute(elementId, attribute) {
		if (!this.currentProfile) {
            showModalMessage('No profile is currently active.');
			return;
        }
        const profile = this.getCurrentProfileData();
        if (!profile[elementId]) {
			return;
        }
        if (!(attribute in profile[elementId])) {
			profile[elementId][attribute] = {};
			return;
        }
        return profile[elementId][attribute];
    }
	
	storeSection(profileId, sectionName, data) {
		if (!this.profiles[profileId]) {
			this.profiles[profileId] = {};
        }
		const profile = this.profiles[profileId];
		if (!profile[sectionName]) {
            profile[sectionName] = {};
        }
		profile[sectionName] = data;
        this.saveToLocalStorage();
	}
	
	retrieveSection(profileId, sectionName) {
		if (!this.profiles[profileId]) {
			this.profiles[profileId] = {};
        }
		const profile = this.profiles[profileId];
		if (!profile[sectionName]) {
            profile[sectionName] = {};
        }
        return profile[sectionName];
    }
	
	setElementStyles(element, styleProperty) {
		if (!element) {
			showModalMessage('Invalid element reference.');
			return;
		}
		const value = this.getAttribute(element.id, styleProperty);
		if (value === undefined) {
			return;
		}
		element.style[styleProperty] = value;
	}
	
	deleteAttribute(elementId, attribute) {
		if (!this.currentProfile) {
			showModalMessage('No profile is currently active.');
			return;
		}
		const profile = this.getCurrentProfileData();
		if (!profile[elementId]) {
			return;
		}
		if (!(attribute in profile[elementId])) {
			return;
		}
		delete profile[elementId][attribute];
		this.saveToLocalStorage();
	}
	
	deleteElement(elementId) {
		if (!this.currentProfile) {
			showModalMessage('No profile is currently active.');
			return;
		}
		const profile = this.getCurrentProfileData();
		if (!profile[elementId]) {
			return;
		}
		delete profile[elementId];
		this.saveToLocalStorage();
	}

	createButtonElement(buttonID) {
		const button = document.createElement('button');
		button.id = buttonID;
		let classes = this.getAttribute(buttonID, 'classes');
		if (typeof classes === 'string') classes = classes.split(' ').filter(Boolean);
		if (!Array.isArray(classes)) classes = [];
		button.classList.add(...classes);
		this.setElementStyles(button, 'height');
		this.setElementStyles(button, 'width');
		this.setElementStyles(button, 'top');
		this.setElementStyles(button, 'left');
		this.setElementStyles(button, 'display');
		this.setElementStyles(button, 'fontSize');
		this.setElementStyles(button, 'fontWeight');
		this.setElementStyles(button, 'color');
		button.innerText = this.getAttribute(buttonID, 'innerText');
		if (classes.includes('S')) {
			processSlide(button);
			return;
		}
		button.addEventListener('click', () => {
			conjunctionJunction(button.id);
		});
		document.body.appendChild(button);
	}

	resetElementsFromProfile() {
		if (!this.currentProfile) {
			showModalMessage('No profile is currently active.');
			return;
		}
		const profile = this.getCurrentProfileData();
		Object.keys(profile).forEach((elementId) => {
			if (elementId !== 'colorSet1') {
				const element = document.getElementById(elementId);
				if (element) {
					element.style.display = '';
					element.style.height = '';
					element.style.width = '';
					element.style.top = '';
					element.style.left = '';
				}
			}
		});
	}
	
	setConsoleUsingProfile(profileName) {
		const profile = this.profiles[profileName] || this.getCurrentProfileData();
		const keys = Object.keys(profile);
		let index = 0;
		const updateBatch = () => {
			const batchSize = 10;
			for (let i = 0; i < batchSize && index < keys.length; i++, index++) {
				const elementId = keys[index];
				const elementSettings = profile[elementId];
				let element = document.getElementById(elementId);
				if (!element && elementId !== "colorSet1") {
					this.createButtonElement(elementId);
				} else if (elementId === "colorSet1") {
					setProperty();
				} else {
					Object.keys(elementSettings).forEach((attribute) => {
						const value = elementSettings[attribute];
						if (attribute in element.style) {
							element.style[attribute] = value;
						} else if (attribute === "classes" && Array.isArray(value)) {
							element.classList.add(...value);
						} else if (attribute === "innerText") {
							element.innerText = value;
						} else {
							this.setAttribute(elementId, attribute, value);
						}
					});
				}
			}
			if (index < keys.length) {
				requestAnimationFrame(updateBatch);
			} else {
				setToggleSwitches();
				document.dispatchEvent(new Event('profileRendered'));
			}
		};
		requestAnimationFrame(updateBatch);
	}

}

function populateProfileDropdown() {
    const profileSelect = document.getElementById('profileSelect');
    profileSelect.innerHTML = '<option value="">-- Select Profile --</option>';
    Object.keys(profileManager.profiles).forEach(profileName => {
		if (profileName !== "userAssist") {
			const option = document.createElement('option');
			option.value = profileName;
			option.textContent = profileName;
			profileSelect.appendChild(option);
		}
    });
	populateProfileDropdownUL();
    updateDisplayedName();
}

function populateProfileDropdownUL() {
	const profileDropdown = document.querySelector('.profileDropdown');
    const profileDropdownUL = document.querySelector('.profileDropdownUL');
    const profileDropdownButton = document.querySelector('.profileDropdownButton');
	const currentProfile = profileManager.currentProfile;
	profileDropdownButton.textContent = `Profile: ${currentProfile}`;
    profileDropdownUL.innerHTML = '';
    Object.keys(profileManager.profiles).forEach(profileName => {
		if (profileName !== "userAssist") {
			const li = document.createElement('li');
			li.textContent = profileName;
			li.addEventListener('click', () => {
				profileManager.changeProfile(profileName);
				profileDropdown.classList.remove('show');
			});
			profileDropdownUL.appendChild(li);
		}
    });
    profileDropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        profileDropdown.classList.toggle('show');
		if (document.querySelector('.dropdown').classList.contains('show')) document.querySelector('.dropdown').classList.remove('show');
		toggleMenuOff();
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profileDropdown')) {
            profileDropdown.classList.remove('show');
        }
    });
}

const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', finalizeActions);
function finalizeActions() {
	const profileName = document.getElementById('profileName');
	const renameProfileInput = document.getElementById('renameProfileInput');
	if (profileName.classList.contains('show')) profileName.classList.remove('show');
	if (renameProfileInput.classList.contains('show')) renameProfileInput.classList.remove('show');
	cancelBtn.classList.remove('show');
	enableAllButtons();
}

const newProfileBtn = document.getElementById('newProfileBtn');
newProfileBtn.addEventListener('click', () => {
	const profileNameInput = document.getElementById('profileName');
	if (!profileNameInput.classList.contains('show')) {
		profileNameInput.classList.add('show');
		disableAllExcept('newProfileBtn');
		return;
	}
    const profileName = profileNameInput.value;
    if (profileName) {
        try {
            profileManager.addProfile(profileName);
            populateProfileDropdown();
            profileNameInput.value = '';
			finalizeActions();
        } catch (error) {
			showModalMessage('Error: New Profile');
        }
    } else {
        showModalMessage('Please enter a profile name.');
    }
});

const changeProfileBtn = document.getElementById('changeProfileBtn');
changeProfileBtn.addEventListener('click', () => {
    const profileName = document.getElementById('profileSelect').value;
    if (profileName) {
        try {
            profileManager.changeProfile(profileName);
        } catch (error) {
            showModalMessage('Error: Change Profile');
        }
    } else {
        showModalMessage('Please select a profile.');
    }
});

const cloneProfileBtn = document.getElementById('cloneProfileBtn');
cloneProfileBtn.addEventListener('click', () => {
    const profileNameInput = document.getElementById('profileName');
    const profileSelect = document.getElementById('profileSelect');
    if (!profileNameInput.classList.contains('show')) {
        profileNameInput.classList.add('show');
		cancelBtn.classList.add('show');
		disableAllExcept('cloneProfileBtn');
        return;
    }
    const originalProfile = profileSelect.value;
    const profileName = profileNameInput.value;
    if (!profileName) {
        showModalMessage('Please enter a name for the new profile.');
        return;
    }
    if (!profileManager.profiles[originalProfile]) {
        showModalMessage('Please select a profile to clone.');
        return;
    }
    try {
        profileManager.cloneProfile(originalProfile, profileName);
        showModalMessage('Profile cloned successfully!');
        profileNameInput.value = '';
		finalizeActions();
        populateProfileDropdown();
    } catch (error) {
        showModalMessage('Error: Clone Profile');
    }
});

const deleteProfileBtn = document.getElementById('deleteProfileBtn');
deleteProfileBtn.addEventListener('click', () => {
    const profileName = document.getElementById('profileSelect').value;
	if (!profileName) {
		showModalMessage('Please select a profile.');
		return;
	}
	try {
		profileManager.deleteProfile(profileName);
		const newProfileName = noCurrentProfile();
		profileManager.changeProfile(newProfileName);
	} catch (error) {
		showModalMessage('Error: Delete Profile');
	}
});

const resetProfileBtn = document.getElementById('resetProfileBtn');
resetProfileBtn.addEventListener('click', () => {
    const profileName = document.getElementById('profileSelect').value;
        if (profileName) {
            try {
            profileManager.resetProfile(profileName);
        } catch (error) {
            showModalMessage('Error: Reset Profile');
        }
    } else {
        showModalMessage('Please select a profile.');
    }
});

const renameProfileBtn = document.getElementById('renameProfileBtn');
renameProfileBtn.addEventListener('click', () => {
	const renameProfileInput = document.getElementById('renameProfileInput');
	if (!renameProfileInput.classList.contains('show')) {
		renameProfileInput.classList.add('show');
		disableAllExcept('renameProfileBtn');
		return;
	}
    const oldName = document.getElementById('profileSelect').value;
    const newName = renameProfileInput.value;
    if (oldName && newName) {
        try {
            profileManager.renameProfile(oldName, newName);
            populateProfileDropdown();
            showModalMessage('Profile renamed successfully!');
			finalizeActions();
        } catch (error) {
            showModalMessage('Error: Rename Profile');
        }
    } else {
        showModalMessage('Please select a profile and enter a new name.');
    }
});

function noCurrentProfile() {
	const remainingProfiles = profileManager.profiles;
	if (Object.keys(remainingProfiles).length === 0) {
		profileManager.currentProfile = 'User1';
		profileManager.profiles["User1"] = defaultProfileInit();
	} else {
		const nextProfile = Object.keys(remainingProfiles)[0];
		profileManager.currentProfile = nextProfile;
	}
	profileManager.saveToLocalStorage();
	return profileManager.currentProfile;
}

async function loadProfileManager() {
	if (!profileManager) {
		profileManager = new ProfileManager();
	}
	const storedProfiles = JSON.parse(localStorage.getItem("profiles")) || {};
	const currentProfile = localStorage.getItem("currentProfile");
	if (Object.keys(storedProfiles).length === 0) {
		profileManager.profiles["User1"] = defaultProfileInit();
		profileManager.profiles["userAssist"] = {};
		profileManager.currentProfile = "User1";
		profileManager.saveToLocalStorage();
		requestIdleCallback(() => {
			createToggleSwitches();
			profileManager.setConsoleUsingProfile("User1");
		});
	} else {
		profileManager.profiles = storedProfiles;
		profileManager.currentProfile = currentProfile || Object.keys(storedProfiles)[0];
		profileManager.saveToLocalStorage();
		requestIdleCallback(() => {
			createToggleSwitches();
			profileManager.setConsoleUsingProfile(profileManager.currentProfile);
		});
	}
}

document.getElementById('layoutMenu').addEventListener('click', () => {
	document.getElementById('layoutBacker').classList.add("show");
});

document.getElementById('closeLayouts').addEventListener('click', function (event) {
	event.preventDefault();
	document.getElementById('layoutBacker').classList.remove("show");
});

let modalTimer;
function showModalMessage(message, time = 2500) {
	const modal = document.getElementById('profileModal');
	if (modalTimer) {
        clearTimeout(modalTimer);
    }
	modal.textContent = message;
	modal.classList.add('profileAlert');
	modalTimer = setTimeout(() => {
        modal.classList.remove('profileAlert');
        modalTimer = null;
    }, time);
}

function updateDisplayedName(name) {
    const profileName = name || profileManager.currentProfile;
    const profileSelect = document.getElementById('profileSelect');
    const options = profileSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === profileName) {
            profileSelect.selectedIndex = i;
            return;
        }
    }
}

function disableAllExcept(buttonId) {
    const buttons = document.querySelectorAll('.btn');
	cancelBtn.classList.add('show');
    buttons.forEach((button) => {
        if (button.id === buttonId || button.id === 'cancelBtn') {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

function enableAllButtons() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button) => {
        button.disabled = false;
    });
}

function refreshElements() {
	localStorage.setItem('skipSplash', 'true');
	location.reload();
}