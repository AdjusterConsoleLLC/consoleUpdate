const disabledForTutorialButtons = [];
function disableForTutorial() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		if (button.disabled && !disabledForTutorialButtons.includes(button)) {
			disabledForTutorialButtons.push(button);
		}
		if (button.classList.contains('tutorialBtn')) {
			button.disabled = false;
		} else {
			button.disabled = true;
		}
	})
}

function enableForTutorial() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		if (!disabledForTutorialButtons.includes(button) && !button.classList.contains('tutorialBtn')) {
			button.disabled = false;
		}
	})
}

const declineTutorial = document.getElementById('declineTutorial')
declineTutorial.addEventListener('click', () => {
	resetWelcome();
	document.getElementById('tutorialHint').classList.add('show');
	setTimeout(() => {
		document.getElementById('tutorialHint').classList.remove('show')
	}, 3000);
})

const acceptTutorial = document.getElementById('acceptTutorial');
acceptTutorial.addEventListener('click', () => {
	const quickIntro = document.getElementById('quickIntro').checked;
	const setupAssistant = document.getElementById('setupAssistant').checked;
	if (!quickIntro && !setupAssistant) return;

	if (quickIntro) {
		startQuickIntro(setupAssistant);
	} else {
		startSetupAssistant();
	}
	resetWelcome();
});


function resetWelcome() {
	document.getElementById('setupAssistant').checked = false;
	document.getElementById('quickIntro').checked = false;
	document.getElementById('welcomeBacker').classList.remove('show');
}

function startQuickIntro(setupAssistant) {
    const tutorial = document.getElementById('quickStartTutorial');
    tutorial.classList.add('show');
    tutorial.dataset.setupAssistant = setupAssistant;
	enableImageZoom();
	document.getElementById('doneQuickTutorial').addEventListener('click', closeQuickIntro, { once: true });
}

function closeQuickIntro() {
	disableImageZoom();
    const tutorial = document.getElementById('quickStartTutorial');
    tutorial.classList.remove('show');
    if (tutorial.dataset.setupAssistant === "true") {
        startSetupAssistant();
    }
}

document.addEventListener('DOMContentLoaded', () => {
	if (document.getElementById('quickStartTutorial').classList.contains('show')) enableImageZoom();
});
	
function enableImageZoom() {
	document.querySelectorAll('.quickCol.imageZoom').forEach(col => {
		const handler = () => {
			const img = col.querySelector('img');
			if (!img) return;
			const overlay = document.getElementById('imgOverlay');
			const fullImg = document.createElement('img');
			fullImg.src = img.src;
			fullImg.id = 'fullImg';
			overlay.appendChild(fullImg);
			overlay.style.display = 'flex';
			overlay.addEventListener('click', () => {
				fullImg.remove();
				overlay.style.display = 'none';
			}, { once: true });
		};
		col._zoomHandler = handler;
		col.addEventListener('click', handler);
	});
}

function disableImageZoom() {
	document.querySelectorAll('.quickCol.imageZoom').forEach(col => {
		if (col._zoomHandler) {
			col.removeEventListener('click', col._zoomHandler);
			delete col._zoomHandler;
		}
	});
}

function startInDepth(setupAssistant) {
    const tutorial = document.getElementById('inDepthTutorial');
    tutorial.classList.add('show');
    tutorial.dataset.setupAssistant = setupAssistant;
	disableForTutorial();
	document.getElementById('nextButton').addEventListener("click", addContent);
	updateTutorial();
}

function closeInDepth() {
    const tutorial = document.getElementById('inDepthTutorial');
    tutorial.classList.remove('show');
	document.getElementById('nextButton').removeEventListener("click", addContent);
    if (tutorial.dataset.setupAssistant === "true") {
        startSetupAssistant();
    }
}

