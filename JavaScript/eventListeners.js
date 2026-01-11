document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('disclaimer')?.addEventListener('click', showDisclaimer);
    document.getElementById('disclaimer2')?.addEventListener('click', () => hideDisclaimer('y'));
    document.getElementById('understand')?.addEventListener('click', () => hideDisclaimer('x'));
    document.getElementById('setColors')?.addEventListener('click', saveColors);
    document.getElementById('exitColor')?.addEventListener('click', exitColor);
    document.getElementById('defaultColors')?.addEventListener('click', () => setColor('default'));
    document.getElementById('presetGrey')?.addEventListener('click', () => setColor('grey'));
    document.getElementById('presetRed')?.addEventListener('click', () => setColor('red'));
    document.getElementById('presetGreen')?.addEventListener('click', () => setColor('green'));
    document.getElementById('presetPink')?.addEventListener('click', () => setColor('pink'));
    document.getElementById('presetRandom')?.addEventListener('click', () => setColor('random'));
    document.getElementById('ConsoleDefault')?.addEventListener('click', () => setColor('ACDF'));
    document.getElementById('e001')?.addEventListener('click', FormToTA);
    document.getElementById('e002')?.addEventListener('click', SENDLABOR1);
    document.getElementById('e003')?.addEventListener('click', SENDDIAG1);
    document.getElementById('e004')?.addEventListener('click', ClearIntake);
    document.getElementById('e005')?.addEventListener('click', AnotherOne);
    document.getElementById('e006')?.addEventListener('click', NextPart);
    document.getElementById('part_labor_copy')?.addEventListener('click', COPYNOTE);
    document.getElementById('part_labor_reset')?.addEventListener('click', RESET);
    [ "p001", "p002", "p003", "p004", "p005", "p006", "p007", "p008" ].forEach((id) => {
		document.getElementById(id)?.addEventListener('click', function () {
			outputText(this.id);
		});
    });
    document.getElementById('LOCK1')?.addEventListener('click', MENU);
    document.getElementById('appearance')?.addEventListener('click', personalize);
    document.getElementById('showToggles')?.addEventListener('click', showTogglesFunct);
    document.getElementById('showShortcutEditor')?.addEventListener('click', async () => { await openShortcutEditor(); });
    document.getElementById('showFileControl')?.addEventListener('click', showFileControlFunct);
    document.getElementById('showWelcome')?.addEventListener('click', () => { document.getElementById("welcomeBacker").classList.add('show'); });
	document.getElementById('masterResetMenu')?.addEventListener('click', MasterReset);
    document.addEventListener('contextmenu', function(event) { customMenu(event.target, event); });
    document.querySelector('.menuToggle')?.addEventListener('click', () => {
		const panel = document.querySelector('.menuPanel');
		panel.classList.toggle('hidden');
	});
});