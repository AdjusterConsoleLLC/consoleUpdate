document.getElementById('authStartBtn')?.addEventListener('click', authBuild);

function authBuild()
{
	const wrap = document.createElement('div');
	wrap.id = 'authWrap';

	const addInput = (labelText, type, elemId, placeholder) =>
	{
		const row = document.createElement('div');
		if (elemId) row.id = elemId + 'row';

		const label = document.createElement('label');
		label.textContent = labelText;

		const input = document.createElement('input');
		input.type = type;

		if (elemId)	{
			input.id = elemId;
			label.htmlFor = elemId;
		}

		if (placeholder){
			input.placeholder = placeholder;
		}

		row.appendChild(label);
		row.appendChild(input);
		wrap.appendChild(row);

		return input;
	};

	addInput('Ver cov for failed components:', 'text', 'verCovInp', 'Failed part and why');
	addInput('PNLC:', 'text', 'pnlcInp');
	addInput('NVF:', 'text', 'nvfInp');
	addInput('Verifications:', 'text', 'verInp');
	
	const radioRow = document.createElement('div');
	radioRow.id = 'iDontKnow';

	const makeRadio = (labelText, value, elemId) =>
	{
		const label = document.createElement('label');

		const input = document.createElement('input');
		input.type = 'radio';
		input.name = 'verType';
		input.value = value;

		if (elemId)
		{
			input.id = elemId;
			label.htmlFor = elemId;
		}

		label.appendChild(input);
		label.appendChild(document.createTextNode(labelText));

		return label;
	};

	radioRow.appendChild(makeRadio('LS', 'LS', 'lsRad'));
	radioRow.appendChild(makeRadio('DVI', 'DVI', 'dviRad'));
	
	const radioLabelDiv = document.createElement('div');
	radioLabelDiv.textContent = 'Type of inspection';
	
	const radioDiv = document.createElement('div');
	radioDiv.appendChild(radioLabelDiv);
	radioDiv.appendChild(radioRow);
	
	wrap.appendChild(radioDiv);

	addInput('Part name', 'text', 'partNameInp');
	addInput('MSRP', 'number', 'msrpInp');
	addInput('R/R Part', 'number', 'rrPartInp');
	addInput('Diag', 'number', 'diagInp');
	addInput('OOP Reasons', 'text', 'oopInp');

	document.body.appendChild(wrap);
}
