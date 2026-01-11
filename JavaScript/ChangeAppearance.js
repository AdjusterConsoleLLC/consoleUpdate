function colorObject() {
	this.shadowCount = 3;
	this.currentShadow = 1;
	this.xOffset1 = 0;
	this.yOffset1 = -1;
	this.blur1 = 0;
	this.spread1 = 0;
	this.shadowColor1 = "rgba(0, 0, 0, 0.3)";
	this.shadowColor1Opacity = 0.3;
	this.isInset1 = true;
	this.xOffset2 = 0;
	this.yOffset2 = 1;
	this.blur2 = 2;
	this.spread2 = 0;
	this.shadowColor2 = "rgba(0, 0, 0, 0.3)";
	this.shadowColor2Opacity = 0.3;
	this.isInset2 = false;
	this.xOffset3 = 0;
	this.yOffset3 = 2;
	this.blur3 = 4;
	this.spread3 = -1;
	this.shadowColor3 = "rgba(0, 0, 0, 0.3)";
	this.shadowColor3Opacity = 0.3;
	this.isInset3 = false;
	this.hasBorder = true;
	this.borderColor = "rgba(0, 0, 0, 0.6)";
	this.borderColorOpacity = 0.6;
	this.borderThickness = 1;
	this.borderRadius = 6;
	this.buttonBackgroundColor = "rgba(255, 255, 255, 1)";
	this.hasGradient = false;
	this.gradientStart = "rgba(0, 0, 0, 0)";
	this.gradientEnd = "rgba(0, 0, 0, 0)";
	this.gradientAngle = 0;
	this.buttonTextColor = "rgba(0, 0, 0, 1)";
	this.pageTextColor = "rgba(255, 255, 255, 1)";
	this.hasTextOutline = false;
	this.textOutlineColor = "rgba(0, 0, 0, 1)";
	this.pageBackgroundColor = "rgba(29, 77, 139, 1)";
	this.accentColor = "rgba(17, 17, 17, 1)";
	this.accentColorOpacity = 1;
}

let colorSetPreview = new colorObject();
function updatePreview() {
	const previewBtn = document.getElementById('previewBtn');
	const previewDiv = document.getElementById('previewDiv');
	const previewTextDiv = document.getElementById('previewTextDiv');
	updateShadowDisplay();
	let boxShadow = '';
	if (colorSetPreview.shadowCount && colorSetPreview.shadowCount > 0) {
		for (let i = 1; i <= colorSetPreview.shadowCount; i++) {
			const xOffset = colorSetPreview[`xOffset${i}`];
			const yOffset = colorSetPreview[`yOffset${i}`];
			const blur = colorSetPreview[`blur${i}`];
			const spread = colorSetPreview[`spread${i}`];
			const shadowColor = colorSetPreview[`shadowColor${i}`];
			const isInset = colorSetPreview[`isInset${i}`] ? 'inset ' : '';
			boxShadow += `${isInset}${xOffset}px ${yOffset}px ${blur}px ${spread}px ${shadowColor}`;
			if (i < colorSetPreview.shadowCount) {
				boxShadow += ', ';
			}
		}
	} else {
		boxShadow = 'none';
	}
	previewBtn.style.boxShadow = boxShadow || 'none';
	if (colorSetPreview.hasBorder) {
		previewBtn.style.border = `${colorSetPreview.borderThickness}px solid ${colorSetPreview.borderColor}`;
	} else {
		previewBtn.style.border = 'none';
	}
	previewBtn.style.borderRadius = `${colorSetPreview.borderRadius}px` || 0;
	if (colorSetPreview.hasGradient) {
		previewBtn.style.background = `linear-gradient(${colorSetPreview.gradientAngle}deg, ${colorSetPreview.gradientStart}, ${colorSetPreview.gradientEnd})`;
	} else {
		previewBtn.style.background = colorSetPreview.buttonBackgroundColor;
	}
	previewBtn.style.color = colorSetPreview.buttonTextColor;
	if (colorSetPreview.hasTextOutline) {
		previewBtn.style.textShadow = `1px 1px 1px ${colorSetPreview.textOutlineColor}, -1px -1px 1px ${colorSetPreview.textOutlineColor}, -1px 1px 1px ${colorSetPreview.textOutlineColor}, 1px -1px 1px ${colorSetPreview.textOutlineColor}`;
	} else {
		previewBtn.style.textShadow = '';
	}
	previewDiv.style.background = `${colorSetPreview.pageBackgroundColor}`;
	previewDiv.style.border = `2px solid ${colorSetPreview.accentColor}`;
	previewDiv.style.borderRadius = `${colorSetPreview.borderRadius}px ` || 0;
	previewTextDiv.style.color = `${colorSetPreview.pageTextColor} `;
	updateCssOutput();
	return;
}

function updateCssOutput() {
    const cssOutputDiv = document.getElementById('cssOutput');
    const colorSet = colorSetPreview;
    cssOutputDiv.innerHTML = '';
    for (let i = 1; i <= colorSet.shadowCount; i++) {
        const shadowSpan = document.createElement('span');
		if (i === colorSet.currentShadow) {
			shadowSpan.style.fontWeight = "bold";
		}
        shadowSpan.textContent = `shadow ${i}: ${colorSet[`isInset${i}`] ? 'inset ' : ''}${colorSet[`xOffset${i}`]}px ${colorSet[`yOffset${i}`]}px ${colorSet[`blur${i}`]}px ${colorSet[`spread${i}`]}px ${colorSet[`shadowColor${i}`]};`;
        cssOutputDiv.appendChild(shadowSpan);
    }
    const borderSpan = document.createElement('span');
    borderSpan.textContent = `border: ${colorSet.hasBorder
        ? `${colorSet.borderThickness}px solid ${colorSet.borderColor}`
        : 'none'};`;
    cssOutputDiv.appendChild(borderSpan);
    const borderRadiusSpan = document.createElement('span');
    borderRadiusSpan.textContent = `border-radius: ${colorSet.borderRadius}px;`;
    cssOutputDiv.appendChild(borderRadiusSpan);
    cssOutputDiv.style.whiteSpace = 'pre-line';
}

function setPicker(colorSet) {
	document.getElementById("shadowCount").value = colorSet.shadowCount >= 1 ? 1 : 0;
	document.getElementById("isInset").checked = colorSet[`isInset${colorSet.currentShadow}`] || false;
	document.getElementById("shadowColor").value = convertToHex(colorSet[`shadowColor${colorSet.currentShadow}`]);
	document.getElementById("shadowColorOpacity").value = colorSet[`shadowColor${colorSet.currentShadow}Opacity`] * 100;
	document.getElementById("hasBorder").checked = colorSet.hasBorder || false;
	document.getElementById("borderColor").value = convertToHex(colorSet.borderColor);
	document.getElementById("borderColorOpacity").value = colorSet.borderColorOpacity * 100;
	document.getElementById("buttonBackgroundColor").value = convertToHex(colorSet.buttonBackgroundColor);
	document.getElementById("hasGradient").checked = colorSet.hasGradient || false;
	document.getElementById("gradientStart").value = convertToHex(colorSet.gradientStart);
	document.getElementById("gradientEnd").value = convertToHex(colorSet.gradientEnd);
	document.getElementById("hasTextOutline").checked = colorSet.hasTextOutline || false;
	document.getElementById("textOutlineColor").value = convertToHex(colorSet.textOutlineColor);
	document.getElementById("textColor").value = convertToHex(colorSet.buttonTextColor);
	document.getElementById("pageBackgroundColor").value = convertToHex(colorSet.pageBackgroundColor);
	document.getElementById("pageTextColor").value = convertToHex(colorSet.pageTextColor);
	document.getElementById("accentColor").value = convertToHex(colorSet.accentColor);
	document.getElementById("accentColorOpacity").value = colorSet.accentColorOpacity * 100;
	colorSetPreview = colorSet;
	updatePreview();
}

function updateShadowDisplay() {
	document.getElementById("shadowCount").textContent = `${colorSetPreview.currentShadow}`;
	document.getElementById('shadowColor').value = convertToHex(colorSetPreview[`shadowColor${colorSetPreview.currentShadow}`]);
	document.getElementById("shadowColorOpacity").value = colorSetPreview[`shadowColor${colorSetPreview.currentShadow}Opacity`] * 100;
	document.getElementById('isInset').checked = colorSetPreview[`isInset${colorSetPreview.currentShadow}`];
}

function setProperty() {
	const profileData = profileManager.getCurrentProfileData();
	const colorSet = profileData.colorSet1;
	let boxShadow = '';
	for (let i = 1; i <= colorSet.shadowCount; i++) {
		const xOffset = colorSet[`xOffset${i}`];
		const yOffset = colorSet[`yOffset${i}`];
		const blur = colorSet[`blur${i}`];
		const spread = colorSet[`spread${i}`];
		const shadowColor = colorSet[`shadowColor${i}`];
		const isInset = colorSet[`isInset${i}`] ? 'inset ' : '';
		boxShadow += `${isInset}${xOffset}px ${yOffset}px ${blur}px ${spread}px ${shadowColor}`;
		if (i < colorSet.shadowCount) {
			boxShadow += ', ';
		}
	}
	document.documentElement.style.setProperty('--boxShadow', boxShadow || 'none');
	if (colorSet.hasBorder) {
		document.documentElement.style.setProperty('--border', `${colorSet.borderThickness}px solid ${colorSet.borderColor}`);
	} else {
		document.documentElement.style.setProperty('--border', 'none');
	}
	document.documentElement.style.setProperty('--borderRadius', `${colorSet.borderRadius}px`);
	if (colorSet.hasGradient) {
		document.documentElement.style.setProperty('--buttonBackgroundColor', `linear-gradient(${colorSet.gradientAngle}deg, ${colorSet.gradientStart}, ${colorSet.gradientEnd})`);
	} else {
		document.documentElement.style.setProperty('--buttonBackgroundColor', colorSet.buttonBackgroundColor);
	}
	document.documentElement.style.setProperty('--buttonTextColor', colorSet.buttonTextColor);
	if (colorSet.hasTextOutline) {
		document.documentElement.style.setProperty('--text-outline', `1px 1px 1px ${colorSet.textOutlineColor}, -1px -1px 1px ${colorSet.textOutlineColor}, -1px 1px 1px ${colorSet.textOutlineColor}, 1px -1px 1px ${colorSet.textOutlineColor}`);
	} else {
		document.documentElement.style.setProperty('--text-outline', 'none');
	}
	document.documentElement.style.setProperty('--pageBackgroundColor', colorSet.pageBackgroundColor);
	document.documentElement.style.setProperty('--pageTextColor', colorSet.pageTextColor);
	document.documentElement.style.setProperty('--accentColor', colorSet.accentColor);
	document.documentElement.style.setProperty('--contrastColor', colorSet.contrastColor);
	return;
}

function setColor(colors) {
	const colorSet = new colorObject();
	switch (colors) {
		case "material":
			Object.assign(colorSet, {
				currentShadow: 1,
				shadowCount: 3,
				xOffset1: 0,
				yOffset1: -1,
				blur1: 0,
				spread1: 0,
				shadowColor1: "rgba(0, 0, 0, 0.3)",
				shadowColor1Opacity: 0.3,
				isInset1: true,
				xOffset2: 0,
				yOffset2: 1,
				blur2: 2,
				spread2: 0,
				shadowColor2: "rgba(0, 0, 0, 0.3)",
				shadowColor2Opacity: 0.3,
				isInset2: false,
				xOffset3: 0,
				yOffset3: 2,
				blur3: 4,
				spread3: -1,
				shadowColor3: "rgba(0, 0, 0, 0.3)",
				shadowColor3Opacity: 0.3,
				isInset3: false,
				hasBorder: true,
				borderColor: "rgba(0, 0, 0, 0.6)",
				borderColorOpacity: 0.6,
				borderThickness: 1,
				borderRadius: 6,
				buttonBackgroundColor: "rgba(255, 255, 255, 1)",
				buttonBackgroundColorOpacity: 1,
				hasGradient: false,
				gradientStart: "rgba(0, 0, 0, 1)",
				gradientStartOpacity: 1,
				gradientEnd: "rgba(0, 0, 0, 1)",
				gradientEndOpacity: 1,
				gradientAngle: 0,
				buttonTextColor: "rgba(0, 0, 0, 1)",
				buttonTextColorOpacity: 1,
				pageTextColor: "rgba(255, 255, 255, 1)",
				hasTextOutline: false,
				textOutlineColor: "rgba(0, 0, 0, 1)",
				textOutlineColorOpacity: 1,
				pageBackgroundColor: "rgba(29, 77, 139, 1)",
				pageBackgroundColorOpacity: 1,
				accentColor: "rgba(17, 17, 17, 1)",
				accentColorOpacity: 1,
			});
		break;
		case "minimal":
			Object.assign(colorSet, {
				currentShadow: 1,
				shadowCount: 1,
				xOffset1: 1,
				yOffset1: 2,
				blur1: 2,
				spread1: -1,
				shadowColor1: "rgba(0, 0, 0, 0.2)",
				shadowColor1Opacity: 0.2,
				isInset1: false,
				xOffset2: 0,
				yOffset2: 0,
				blur2: 0,
				spread2: 0,
				shadowColor2: "rgba(0, 0, 0, 0)",
				shadowColor2Opacity: 0,
				isInset2: false,
				xOffset3: 0,
				yOffset3: 0,
				blur3: 0,
				spread3: 0,
				shadowColor3: "rgba(0, 0, 0, 0)",
				shadowColor3Opacity: 0,
				isInset3: false,
				hasBorder: false,
				borderColor: "rgba(0, 0, 0, 0.6)",
				borderRadius: 5,
				borderColorOpacity: 0,
				borderThickness: 1,
				buttonBackgroundColor: "rgba(255, 255, 255, 1)",
				buttonBackgroundColorOpacity: 1,
				hasGradient: false,
				gradientStart: "rgba(0, 0, 0, 1)",
				gradientStartOpacity: 1,
				gradientEnd: "rgba(0, 0, 0, 1)",
				gradientEndOpacity: 1,
				gradientAngle: 0,
				buttonTextColor: "rgba(0, 0, 0, 1)",
				buttonTextColorOpacity: 1,
				pageTextColor: "rgba(0, 0, 0, 1)",
				hasTextOutline: false,
				textOutlineColor: "rgba(0, 0, 0, 1)",
				textOutlineColorOpacity: 1,
				pageBackgroundColor: "rgba(230, 226, 219, 1)",
				pageBackgroundColorOpacity: 1,
				accentColor: "rgba(0, 0, 0, 1)",
				accentColorOpacity: 1,
			});
		break;
		case "colormorph":
			Object.assign(colorSet, {
				currentShadow: 1,
				shadowCount: 2,
				xOffset1: 2,
				yOffset1: 2,
				blur1: 4,
				spread1: 0,
				shadowColor1: "rgba(18, 47, 84, 1)",
				shadowColor1Opacity: 1,
				isInset1: false,
				xOffset2: -2,
				yOffset2: -2,
				blur2: 4,
				spread2: 0,
				shadowColor2: "rgba(42, 109, 198, 1)",
				shadowColor2Opacity: 1,
				isInset2: false,
				xOffset3: 0,
				yOffset3: 0,
				blur3: 0,
				spread3: 0,
				shadowColor3: "rgba(0, 0, 0, 1)",
				shadowColor3Opacity: 1,
				isInset3: false,
				hasBorder: false,
				borderColor: "rgba(0, 0, 0, 1)",
				borderColorOpacity: 1,
				borderThickness: 0,
				borderRadius: 10,
				buttonBackgroundColor: "rgba(0, 0, 0, 1)",
				buttonBackgroundColorOpacity: 1,
				hasGradient: true,
				gradientStart: "rgba(21, 56, 102, 1)",
				gradientStartOpacity: 1,
				gradientEnd: "rgba(37, 95, 173, 1)",
				gradientEndOpacity: 1,
				gradientAngle: 145,
				buttonTextColor: "rgba(255, 255, 255, 1)",
				buttonTextColorOpacity: 1,
				pageTextColor: "rgba(0, 0, 0, 1)",
				hasTextOutline: true,
				textOutlineColor: "rgba(0, 0, 0, 1)",
				textOutlineColorOpacity: 1,
				pageBackgroundColor: "rgba(29, 77, 139, 1)",
				pageBackgroundColorOpacity: 1,
				accentColor: "rgba(29, 77, 139, 1)",
				accentColorOpacity: 1,
			});
		break;
		case "glassmorph":
			Object.assign(colorSet, {
				currentShadow: 1,
				shadowCount: 2,
				xOffset1: 0,
				yOffset1: 4,
				blur1: 10,
				spread1: 0,
				shadowColor1: "rgba(0, 0, 0, 0.15)",
				shadowColor1Opacity: 0.15,
				isInset1: false,
				xOffset2: 0,
				yOffset2: 0,
				blur2: 0,
				spread2: 0,
				shadowColor2: "rgba(255, 255, 255, 0.4)",
				shadowColor2Opacity: 0.4,
				isInset2: true,
				xOffset3: 0,
				yOffset3: 0,
				blur3: 0,
				spread3: 0,
				shadowColor3: "rgba(0, 0, 0, 0)",
				shadowColor3Opacity: 0,
				isInset3: false,
				hasBorder: true,
				borderColor: "rgba(255, 255, 255, 0.25)",
				borderColorOpacity: 0.25,
				borderThickness: 1,
				borderRadius: 14,
				buttonBackgroundColor: "rgba(255, 255, 255, 0.12)",
				buttonBackgroundColorOpacity: 0.12,
				hasGradient: true,
				gradientStart: "rgba(34, 67, 110, 1)",
				gradientStartOpacity: 0.05,
				gradientEnd: "rgba(55, 85, 124, 1)",
				gradientEndOpacity: 0.15,
				gradientAngle: 120,
				buttonTextColor: "rgba(255, 255, 255, 0.9)",
				buttonTextColorOpacity: 1,
				pageTextColor: "rgba(255, 255, 255, 1)",
				hasTextOutline: false,
				textOutlineColor: "rgba(0, 0, 0, 1)",
				textOutlineColorOpacity: 1,
				pageBackgroundColor: "rgba(21, 56, 102, 1)",
				pageBackgroundColorOpacity: 1,
				accentColor: "rgba(255, 255, 255, 0.4)",
				accentColorOpacity: 0.4,
			});
		break;
		case "circuit":
			Object.assign(colorSet, {
				currentShadow: 1,
				shadowCount: 2,
				xOffset1: 0,
				yOffset1: 0,
				blur1: 10,
				spread1: 0,
				shadowColor1: "rgba(0, 255, 255, 0.25)",
				shadowColor1Opacity: 0.25,
				isInset1: false,
				xOffset2: 0,
				yOffset2: 0,
				blur2: 2,
				spread2: 1,
				shadowColor2: "rgba(0, 255, 255, 0.15)",
				shadowColor2Opacity: 0.15,
				isInset2: true,
				xOffset3: 0,
				yOffset3: 0,
				blur3: 0,
				spread3: 0,
				shadowColor3: "rgba(0, 0, 0, 0)",
				shadowColor3Opacity: 0,
				isInset3: false,
				hasBorder: true,
				borderColor: "rgba(0, 255, 255, 0.6)",
				borderColorOpacity: 0.6,
				borderThickness: 1,
				borderRadius: 4,
				buttonBackgroundColor: "rgba(0, 0, 0, 1)",
				buttonBackgroundColorOpacity: 1,
				hasGradient: true,
				gradientStart: "rgba(0, 255, 255, 0.3)",
				gradientStartOpacity: 0.3,
				gradientEnd: "rgba(0, 128, 255, 0.4)",
				gradientEndOpacity: 0.4,
				gradientAngle: 90,
				buttonTextColor: "rgba(0, 255, 255, 1)",
				buttonTextColorOpacity: 1,
				pageTextColor: "rgba(0, 255, 255, 1)",
				hasTextOutline: true,
				textOutlineColor: "rgba(0, 0, 0, 1)",
				textOutlineColorOpacity: 1,
				pageBackgroundColor: "rgba(8, 12, 20, 1)",
				pageBackgroundColorOpacity: 1,
				accentColor: "rgba(0, 255, 255, 1)",
				accentColorOpacity: 1,
			});
		break;
	}
	const profileData = profileManager.getCurrentProfileData();
	profileData.colorSet1 = colorSet;
	colorSetPreview = colorSet;
	profileManager.saveToLocalStorage();
	setPicker(colorSet);
	updatePreview();
	setProperty();
	setInputAblilites();
	return;
}

function personalize() {
	document.getElementById("appearDiv").classList.add('show');
	addAppearanceListeners();
	updateShadowDisplay();
	setInputAblilites();
}

function exitColor() {
	removeAppearanceListeners();
	document.getElementById("appearDiv").classList.remove('show');
}

function saveColors() {
	const profileData = profileManager.getCurrentProfileData();
	profileData.colorSet1 = colorSetPreview;
	profileManager.saveToLocalStorage();
	setProperty();
	exitColor();
}

function resetColors() {
	const profileData = profileManager.getCurrentProfileData();
	const colorSet = profileData.colorSet1;
	colorSetPreview = profileData.colorSet1;
	colorSetPreview.currentShadow = 1;
	setPicker(colorSet);
	setProperty();
	setInputAblilites();
	return;
}

function hasBorderHandle(event) {
	colorSetPreview.hasBorder = event.target.checked;
	setInputAblilites();
	updatePreview();
}

function borderColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value, colorSetPreview.borderColorOpacity) || "rgba(0, 0, 0, 1)";
	colorSetPreview.borderColor = rgbColor; updatePreview();
	
	}
function borderColorOpacityHandle(event) {
	const sliderValue = parseInt(document.getElementById("borderColorOpacity").value, 10);
	const opacityDecimal = (sliderValue / 100).toFixed(2);
	const opacityInt = parseFloat(opacityDecimal);
	colorSetPreview.borderColor = updateOpacity(colorSetPreview.borderColor, opacityInt);
	colorSetPreview.borderColorOpacity = opacityInt;
	updatePreview();
}

function borderThicknessIncrementHandle() {
	colorSetPreview.borderThickness = (colorSetPreview.borderThickness || 0) + 1;
	updatePreview();
}

function borderThicknessDecrementHandle() {
	colorSetPreview.borderThickness = Math.max((colorSetPreview.borderThickness || 0) - 1, 0);
	updatePreview();
}

function borderRadiusIncrementHandle() {
	colorSetPreview.borderRadius = (colorSetPreview.borderRadius || 0) + 1;
	updatePreview();
}

function borderRadiusDecrementHandle() {
	colorSetPreview.borderRadius = Math.max((colorSetPreview.borderRadius || 0) - 1, 0);
	updatePreview();
}

function buttonBackgroundColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "rgba(0, 0, 0, 1)";
	colorSetPreview.buttonBackgroundColor = rgbColor;
	updatePreview();
}

function hasGradientHandle(event) {
	colorSetPreview.hasGradient = event.target.checked;
	setInputAblilites();
	updatePreview();
}

function gradientStartHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "rgba(0, 0, 0, 1)";
	colorSetPreview.gradientStart = rgbColor;
	updatePreview();
}

function gradientEndHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "rgba(0, 0, 0, 1)";
	colorSetPreview.gradientEnd = rgbColor;
	updatePreview();
}

function angleIncrementHandle() {
	colorSetPreview.gradientAngle = (colorSetPreview.gradientAngle || 0) + 5;
	updatePreview();
}

function angleDecrementHandle() {
	colorSetPreview.gradientAngle = (colorSetPreview.gradientAngle || 0) - 5;
	updatePreview();
}

function textColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "rgba(0, 0, 0, 1)";
	colorSetPreview.buttonTextColor = rgbColor;
	updatePreview();
}

function hasTextOutlineHandle(event) {
	colorSetPreview.hasTextOutline = event.target.checked;
	setInputAblilites();
	updatePreview();
}

function textOutlineColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "rgba(0, 0, 0, 1)";
	colorSetPreview.textOutlineColor = rgbColor; updatePreview();
}

function pageBackgroundColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "#000000";
	colorSetPreview.pageBackgroundColor = event.target.value || "rgba(0, 0, 0, 1)";
	updatePreview();
}

function pageTextColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value) || "#ffffff";
	colorSetPreview.pageTextColor = event.target.value || "rgba(255, 255, 255, 1)";
	updatePreview();
}

function accentColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value, colorSetPreview.accentColorOpacity) || "rgba(0, 0, 0, 1)";
	colorSetPreview.accentColor = rgbColor;
	updatePreview();
}

function accentColorOpacityHandle(event) {
	const sliderValue = parseInt(document.getElementById("accentColorOpacity").value, 10);
	const opacityDecimal = (sliderValue / 100).toFixed(2);
	const opacityInt = parseFloat(opacityDecimal);
	colorSetPreview.accentColor = updateOpacity(colorSetPreview.accentColor, opacityInt);
	colorSetPreview.accentColorOpacity = opacityInt;
	updatePreview();
}

function presetMaterialHandle() {
	setColor("material");
}

function presetColorMorphHandle() {
	setColor("colormorph");
}

function presetGlassMorphHandle() {
	setColor("glassmorph");
}

function defaultCircuitHandle() {
	setColor("circuit");
}

function presetMinimalHandle() {
	setColor("minimal");
}

function yOffsetIncrementHandle() {
	colorSetPreview[`yOffset${colorSetPreview.currentShadow}`] = (colorSetPreview[`yOffset${colorSetPreview.currentShadow}`] || 0) + 1;
	updatePreview();
}

function yOffsetDecrementHandle() {
	colorSetPreview[`yOffset${colorSetPreview.currentShadow}`] = (colorSetPreview[`yOffset${colorSetPreview.currentShadow}`] || 0) - 1;
	updatePreview();
}

function xOffsetIncrementHandle() {
	colorSetPreview[`xOffset${colorSetPreview.currentShadow}`] = (colorSetPreview[`xOffset${colorSetPreview.currentShadow}`] || 0) + 1;
	updatePreview();
}
	
function xOffsetDecrementHandle() {
	colorSetPreview[`xOffset${colorSetPreview.currentShadow}`] = (colorSetPreview[`xOffset${colorSetPreview.currentShadow}`] || 0) - 1;
	updatePreview();
}

function blurIncrementHandle() {
	colorSetPreview[`blur${colorSetPreview.currentShadow}`] = (colorSetPreview[`blur${colorSetPreview.currentShadow}`] || 0) + 1;
	updatePreview();
}

function blurDecrementHandle() {
	colorSetPreview[`blur${colorSetPreview.currentShadow}`] = Math.max((colorSetPreview[`blur${colorSetPreview.currentShadow}`] || 0) - 1, 0);
	updatePreview();
}

function blurDecrementHandle() {
	colorSetPreview[`blur${colorSetPreview.currentShadow}`] = Math.max((colorSetPreview[`blur${colorSetPreview.currentShadow}`] || 0) - 1, 0);
	updatePreview();
}

function spreadIncrementHandle() {
	colorSetPreview[`spread${colorSetPreview.currentShadow}`] = (colorSetPreview[`spread${colorSetPreview.currentShadow}`] || 0) + 1;
	updatePreview();
}

function spreadDecrementHandle() {
	colorSetPreview[`spread${colorSetPreview.currentShadow}`] = (colorSetPreview[`spread${colorSetPreview.currentShadow}`] || 0) - 1;
	updatePreview();
}

function shadowColorHandle(event) {
	const rgbColor = convertToRGBA(event.target.value, colorSetPreview[`shadowColor${colorSetPreview.currentShadow}Opacity`]) || "rgba(0, 0, 0, 1)";
	colorSetPreview[`shadowColor${colorSetPreview.currentShadow}`] = rgbColor;
	updatePreview();
}

function shadowColorOpacityHandle(event) {
	const sliderValue = parseInt(document.getElementById("shadowColorOpacity").value, 10);
	const opacityDecimal = (sliderValue / 100).toFixed(2);
	const opacityInt = parseFloat(opacityDecimal);
	colorSetPreview[`shadowColor${colorSetPreview.currentShadow}`] = updateOpacity(colorSetPreview[`shadowColor${colorSetPreview.currentShadow}`], opacityInt);
	colorSetPreview[`shadowColor${colorSetPreview.currentShadow}Opacity`] = opacityInt;
	updatePreview();
}

function isInsetHandle(event) {
	colorSetPreview[`isInset${colorSetPreview.currentShadow}`] = event.target.checked; updatePreview();
}

function nextShadowHandle() {
	if (colorSetPreview.currentShadow < 3) {
		colorSetPreview.currentShadow++;
		if (colorSetPreview.currentShadow > colorSetPreview.shadowCount) {
			colorSetPreview.shadowCount++;
			colorSetPreview[`xOffset${colorSetPreview.currentShadow}`] = 0;
			colorSetPreview[`yOffset${colorSetPreview.currentShadow}`] = 0;
			colorSetPreview[`blur${colorSetPreview.currentShadow}`] = 0;
			colorSetPreview[`spread${colorSetPreview.currentShadow}`] = 0;
			colorSetPreview[`shadowColor${colorSetPreview.currentShadow}`] = "rgba(0, 0, 0, 1)";
			colorSetPreview[`isInset${colorSetPreview.currentShadow}`] = false;
		}
		updateShadowDisplay();
		updatePreview();
	}
}

function prevShadowHandle() {
	if (colorSetPreview.currentShadow > 1) {
		colorSetPreview.currentShadow--;
		updateShadowDisplay();
		updatePreview();
	}
}

function deleteShadowHandle() {
	if (colorSetPreview.shadowCount > 1) {
		for (let i = colorSetPreview.currentShadow; i < colorSetPreview.shadowCount; i++) {
			colorSetPreview[`xOffset${i}`] = colorSetPreview[`xOffset${i + 1}`];
			colorSetPreview[`yOffset${i}`] = colorSetPreview[`yOffset${i + 1}`];
			colorSetPreview[`blur${i}`] = colorSetPreview[`blur${i + 1}`];
			colorSetPreview[`spread${i}`] = colorSetPreview[`spread${i + 1}`];
			colorSetPreview[`shadowColor${i}`] = colorSetPreview[`shadowColor${i + 1}`];
			colorSetPreview[`isInset${i}`] = colorSetPreview[`isInset${i + 1}`];
		}
		const lastShadow = colorSetPreview.shadowCount;
		delete colorSetPreview[`xOffset${lastShadow}`];
		delete colorSetPreview[`yOffset${lastShadow}`];
		delete colorSetPreview[`blur${lastShadow}`];
		delete colorSetPreview[`spread${lastShadow}`];
		delete colorSetPreview[`shadowColor${lastShadow}`];
		delete colorSetPreview[`isInset${lastShadow}`];
		colorSetPreview.shadowCount--;
		colorSetPreview.currentShadow = Math.min(colorSetPreview.currentShadow, colorSetPreview.shadowCount);
	} else if (colorSetPreview.shadowCount === 1) {
		colorSetPreview[`xOffset${colorSetPreview.currentShadow}`] = 0;
		colorSetPreview[`yOffset${colorSetPreview.currentShadow}`] = 0;
		colorSetPreview[`blur${colorSetPreview.currentShadow}`] = 0;
		colorSetPreview[`spread${colorSetPreview.currentShadow}`] = 0;
		colorSetPreview[`shadowColor${colorSetPreview.currentShadow}`] = "rgba(0, 0, 0, 1)";
		colorSetPreview[`isInset${colorSetPreview.currentShadow}`] = false;
	}
	updateShadowDisplay();
	updatePreview();
}

function setInputAblilites() {
	if (colorSetPreview.hasBorder) {
		document.getElementById("borderColor").disabled = false;
		document.getElementById("borderColorOpacity").disabled = false;
		document.getElementById("borderThicknessIncrement").disabled = false;
		document.getElementById("borderThicknessDecrement").disabled = false;
	} else {
		document.getElementById("borderColor").disabled = true;
		document.getElementById("borderColorOpacity").disabled = true;
		document.getElementById("borderThicknessIncrement").disabled = true;
		document.getElementById("borderThicknessDecrement").disabled = true;
	}
	if (colorSetPreview.hasGradient) {
		document.getElementById("buttonBackgroundColor").disabled = true;
		document.getElementById("gradientStart").disabled = false;
		document.getElementById("gradientEnd").disabled = false;
		document.getElementById("angleIncrement").disabled = false;
		document.getElementById("angleDecrement").disabled = false;
	} else {
		document.getElementById("buttonBackgroundColor").disabled = false;
		document.getElementById("gradientStart").disabled = true;
		document.getElementById("gradientEnd").disabled = true;
		document.getElementById("angleIncrement").disabled = true;
		document.getElementById("angleDecrement").disabled = true;
	}
	if (colorSetPreview.hasTextOutline) {
		document.getElementById("textOutlineColor").disabled = false;
	} else {
		document.getElementById("textOutlineColor").disabled = true;
	}
}

function convertToRGBA(hex, opacity = 1) {
	if (hex.startsWith('#')) {
		hex = hex.slice(1);
	}
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	opacity = Math.max(0, Math.min(1, opacity));
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function convertToHex(rgba) {
	const match = rgba.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(0|0?\.\d+|1))?\)$/);
	if (!match) {
		return `#ffffff`;
	}
	const [_, r, g, b] = match.map(Number);
	const sanitizedValues = [r, g, b].map(value => {
    if (value < 0 || value > 255 || isNaN(value)) {
		return 255;
	}
		return value;
	});
	const toHex = (value) => value.toString(16).padStart(2, "0");
	return `#${toHex(sanitizedValues[0])}${toHex(sanitizedValues[1])}${toHex(sanitizedValues[2])}`;
}

function updateOpacity(rgba, newOpacity) {
	const match = rgba.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(0|0?\.\d+|1))?\)$/);
	if (!match) {
		return `rgba(0, 0, 0, ${Math.max(0, Math.min(1, newOpacity))})`;
	}
	const r = parseInt(match[1], 10) || 0;
	const g = parseInt(match[2], 10) || 0;
	const b = parseInt(match[3], 10) || 0;
	const sanitizedR = Math.max(0, Math.min(255, r));
	const sanitizedG = Math.max(0, Math.min(255, g));
	const sanitizedB = Math.max(0, Math.min(255, b));
	const sanitizedOpacity = Math.max(0, Math.min(1, newOpacity));
	return `rgba(${sanitizedR}, ${sanitizedG}, ${sanitizedB}, ${sanitizedOpacity})`;
}

function getContrastRatio(color1, color2) {
    const rgb1 = convertToRgb(color1);
    const rgb2 = convertToRgb(color2);
    const luminance1 = calculateLuminance(rgb1);
    const luminance2 = calculateLuminance(rgb2);
    const ratio = luminance1 > luminance2
        ? (luminance1 + 0.05) / (luminance2 + 0.05)
        : (luminance2 + 0.05) / (luminance1 + 0.05);
    return ratio >= 5;
}

function convertToRgb(color) {
    if (color.startsWith("#")) {
        return hexToRgb(color);
    } else if (color.startsWith("rgb")) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        }
    }
    return null;
}

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(char => char + char).join("");
    }
    const intVal = parseInt(hex, 16);
    return [(intVal >> 16) & 255, (intVal >> 8) & 255, intVal & 255];
}

function calculateLuminance([r, g, b]) {
    const srgb = [r, g, b].map(value => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function getHighContrastColor(inputColor) {
    const rgbColor = convertToRgb(inputColor);
    const inputLuminance = calculateLuminance(rgbColor);
    const blackContrast = (inputLuminance + 0.05) / (0.05);
    const whiteContrast = (1.05) / (inputLuminance + 0.05);
    return blackContrast > whiteContrast ? "#000000" : "#FFFFFF";
}

function addAppearanceListeners() {
	document.getElementById("xOffsetIncrement")?.addEventListener("click", xOffsetIncrementHandle);
	document.getElementById("xOffsetDecrement")?.addEventListener("click", xOffsetDecrementHandle);
	document.getElementById("yOffsetIncrement")?.addEventListener("click", yOffsetIncrementHandle);
	document.getElementById("yOffsetDecrement")?.addEventListener("click", yOffsetDecrementHandle);
	document.getElementById("blurIncrement")?.addEventListener("click", blurIncrementHandle);
	document.getElementById("blurDecrement")?.addEventListener("click", blurDecrementHandle);
	document.getElementById("spreadIncrement")?.addEventListener("click", spreadIncrementHandle);
	document.getElementById("spreadDecrement")?.addEventListener("click", spreadDecrementHandle);
	document.getElementById("shadowColor")?.addEventListener("input", shadowColorHandle);
	document.getElementById("shadowColorOpacity")?.addEventListener("input", shadowColorOpacityHandle);
	document.getElementById("isInset")?.addEventListener("change", isInsetHandle);
	document.getElementById("nextShadow")?.addEventListener("click", nextShadowHandle);
	document.getElementById("prevShadow")?.addEventListener("click", prevShadowHandle);
	document.getElementById("deleteShadow")?.addEventListener("click", deleteShadowHandle);
	document.getElementById("hasBorder")?.addEventListener("change", hasBorderHandle);
	document.getElementById("borderColor")?.addEventListener("input", borderColorHandle);
	document.getElementById("borderColorOpacity")?.addEventListener("input", borderColorOpacityHandle);
	document.getElementById("borderThicknessIncrement")?.addEventListener("click", borderThicknessIncrementHandle);
	document.getElementById("borderThicknessDecrement")?.addEventListener("click", borderThicknessDecrementHandle);
	document.getElementById("borderRadiusIncrement")?.addEventListener("click", borderRadiusIncrementHandle);
	document.getElementById("borderRadiusDecrement")?.addEventListener("click", borderRadiusDecrementHandle);
	document.getElementById("buttonBackgroundColor")?.addEventListener("input", buttonBackgroundColorHandle);
	document.getElementById("hasGradient")?.addEventListener("change", hasGradientHandle);
	document.getElementById("gradientStart")?.addEventListener("input", gradientStartHandle);
	document.getElementById("gradientEnd")?.addEventListener("input", gradientEndHandle);
	document.getElementById("angleIncrement")?.addEventListener("click", angleIncrementHandle);
	document.getElementById("angleDecrement")?.addEventListener("click", angleDecrementHandle);
	document.getElementById("textColor")?.addEventListener("input", textColorHandle);
	document.getElementById("hasTextOutline")?.addEventListener("change", hasTextOutlineHandle);
	document.getElementById("textOutlineColor")?.addEventListener("input", textOutlineColorHandle);
	document.getElementById("pageBackgroundColor")?.addEventListener("input", pageBackgroundColorHandle);
	document.getElementById("pageTextColor")?.addEventListener("input", pageTextColorHandle);
	document.getElementById("accentColor")?.addEventListener("input", accentColorHandle);
	document.getElementById("accentColorOpacity")?.addEventListener("input", accentColorOpacityHandle);
	document.getElementById("defaultCircuit")?.addEventListener("click", defaultCircuitHandle);
	document.getElementById("presetMinimal")?.addEventListener("click", presetMinimalHandle);
	document.getElementById("presetColorMorph")?.addEventListener("click", presetColorMorphHandle);
	document.getElementById("presetGlassMorph")?.addEventListener("click", presetGlassMorphHandle);
	document.getElementById("presetMaterial")?.addEventListener("click", presetMaterialHandle);
}

function removeAppearanceListeners() {
	document.getElementById("xOffsetIncrement")?.removeEventListener("click", xOffsetIncrementHandle);
	document.getElementById("xOffsetDecrement")?.removeEventListener("click", xOffsetDecrementHandle);
	document.getElementById("yOffsetIncrement")?.removeEventListener("click", yOffsetIncrementHandle);
	document.getElementById("yOffsetDecrement")?.removeEventListener("click", yOffsetDecrementHandle);
	document.getElementById("blurIncrement")?.removeEventListener("click", blurIncrementHandle);
	document.getElementById("blurDecrement")?.removeEventListener("click", blurDecrementHandle);
	document.getElementById("spreadIncrement")?.removeEventListener("click", spreadIncrementHandle);
	document.getElementById("spreadDecrement")?.removeEventListener("click", spreadDecrementHandle);
	document.getElementById("shadowColor")?.removeEventListener("input", shadowColorHandle);
	document.getElementById("shadowColorOpacity")?.removeEventListener("input", shadowColorOpacityHandle);
	document.getElementById("isInset")?.removeEventListener("change", isInsetHandle);
	document.getElementById("nextShadow")?.removeEventListener("click", nextShadowHandle);
	document.getElementById("prevShadow")?.removeEventListener("click", prevShadowHandle);
	document.getElementById("deleteShadow")?.removeEventListener("click", deleteShadowHandle);
	document.getElementById("hasBorder")?.removeEventListener("change", hasBorderHandle);
	document.getElementById("borderColor")?.removeEventListener("input", borderColorHandle);
	document.getElementById("borderColorOpacity")?.removeEventListener("input", borderColorOpacityHandle);
	document.getElementById("borderThicknessIncrement")?.removeEventListener("click", borderThicknessIncrementHandle);
	document.getElementById("borderThicknessDecrement")?.removeEventListener("click", borderThicknessDecrementHandle);
	document.getElementById("borderRadiusIncrement")?.removeEventListener("click", borderRadiusIncrementHandle);
	document.getElementById("borderRadiusDecrement")?.removeEventListener("click", borderRadiusDecrementHandle);
	document.getElementById("buttonBackgroundColor")?.removeEventListener("input", buttonBackgroundColorHandle);
	document.getElementById("hasGradient")?.removeEventListener("change", hasGradientHandle);
	document.getElementById("gradientStart")?.removeEventListener("input", gradientStartHandle);
	document.getElementById("gradientEnd")?.removeEventListener("input", gradientEndHandle);
	document.getElementById("angleIncrement")?.removeEventListener("click", angleIncrementHandle);
	document.getElementById("angleDecrement")?.removeEventListener("click", angleDecrementHandle);
	document.getElementById("textColor")?.removeEventListener("input", textColorHandle);
	document.getElementById("hasTextOutline")?.removeEventListener("change", hasTextOutlineHandle);
	document.getElementById("textOutlineColor")?.removeEventListener("input", textOutlineColorHandle);
	document.getElementById("pageBackgroundColor")?.removeEventListener("input", pageBackgroundColorHandle);
	document.getElementById("pageTextColor")?.removeEventListener("input", pageTextColorHandle);
	document.getElementById("accentColor")?.removeEventListener("input", accentColorHandle);
	document.getElementById("accentColorOpacity")?.removeEventListener("input", accentColorOpacityHandle);
	document.getElementById("defaultCircuit")?.removeEventListener("click", defaultCircuitHandle);
	document.getElementById("presetMinimal")?.removeEventListener("click", presetMinimalHandle);
	document.getElementById("presetGlassMorph")?.removeEventListener("click", presetGlassMorphHandle);
	document.getElementById("presetColorMorph")?.removeEventListener("click", presetColorMorphHandle);
	document.getElementById("presetMaterial")?.removeEventListener("click", presetMaterialHandle);
}