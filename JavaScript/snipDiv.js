async function copy(text) {
	const notification = document.getElementById('copy-notification');
	try {
		await navigator.clipboard.writeText(text);
		notification.style.top = '15px';
		setTimeout(() => {
			notification.style.top = '-55px';
		}, 800);
	} catch (err) {
		showModalMessage('Failed to copy text');
	}
}

function setButtonDisplay(buttonIds, displayStyle) {
	buttonIds.forEach(function (btnId) {
		document.getElementById(btnId).style.display = displayStyle;
	});
}

function setElementValue(buttonId, value) {
	buttonId.forEach(function (btnIds) {
		document.getElementById(btnIds).value = value;
	});
}

function RESET() {
	newpartcount = 2;
	setElementValue(["textarea2", "textarea3", "textarea4", "textarea5", "EDITarea"], "");
	resetSets();
	resetEditableDiv();
}

function resetEditableDiv() {
    document.getElementById("textarea1").innerHTML = `
        CONTACT:&nbsp;&nbsp;<br>
        <span class="boyta" id="CopyPaymentBTN">PAYMENT:</span>&nbsp;&nbsp;<br>
        <span class="boyta" id="CopyZipBTN">ZIPCODE:</span>&nbsp;&nbsp;<br>
        <span class="boyta" id="CopyMileBTN">MILEAGE:</span>&nbsp;&nbsp;<br>
        DISTANCE:&nbsp;&nbsp;<br>
        TIME:&nbsp;&nbsp;
    `;
}

document.addEventListener('DOMContentLoaded', assignListeners);
function assignListeners() {
	document.getElementById('s001')?.addEventListener('click', function () {
		document.getElementById('s001').style.display = "none";
	
	});
	document.getElementById('s002')?.addEventListener('click', function () {
		document.getElementById('s002').style.display = "none";
	});
	
	//for output
	const outputIds = [ 
		"c001_b001", "c001_b002", "c001_b003", 
		"c002_b001", "c002_b002", "c002_b003", 
		"c003_b001", "c003_b002", "c003_b003", 
		"b001", "b002", "b003", "b004", "b005", "b006", "b007", "b008",
		"s001_b001", "s001_b002", "s001_b003", 
		"s001_ss001_b001", "s001_ss001_b002", 
		"s001_ss001_b003", "s001_ss001_b004",
		"s002_ss001_b001", "s002_ss001_b002", 
		"s002_ss001_b003", "s002_ss001_b004", 
		"s002_ss002_b001", "s002_ss002_b002", 
		"s002_ss002_b003", "s002_ss002_b004", 
		"s002_ss003_b001", "s002_ss003_b002", 
		"s002_ss003_b003", "s002_ss003_b004" 
	];
	
    outputIds.forEach((id) => {
    const element = document.getElementById(id);
		if (element) {
			element.addEventListener('click', function () {
				outputText(this.id); 
			});
		}
	});

	//for opening the next div
	const openIds = [ "s001", "s001_ss001", "s002", "s002_ss001", "s002_ss002", "s002_ss003" ];
	openIds.forEach((id) => {
		document.getElementById(id)?.addEventListener('click', function () {
			if (document.getElementById(id).classList.contains('snap')) return;
			document.getElementById(id + '_btns').classList.add('show');
		});
    });

	//for closing the div the button clicked is in
	const closeIds = [ 
		"s001_ss001", "s001_b001", "s001_b002", "s001_b003", 
		"s002_ss001", "s002_ss002", "s002_ss003", 
		"s001_ss001_b001", "s001_ss001_b002", "s001_ss001_b003", "s001_ss001_b004", 
		"s002_ss001_b001", "s002_ss001_b002", "s002_ss001_b003", "s002_ss001_b004", 
		"s002_ss002_b001", "s002_ss002_b002", "s002_ss002_b003", "s002_ss002_b004", 
		"s002_ss003_b001", "s002_ss003_b002", "s002_ss003_b003", "s002_ss003_b004" 
	];
	closeIds.forEach((id) => {
		document.getElementById(id)?.addEventListener('click', function () {
			if (document.getElementById(id)?.classList.contains('snap')) return;
			const lastIndex = id.lastIndexOf('_');
			const elemId = id.slice(0, lastIndex);
			document.getElementById(elemId + '_btns').classList.remove('show');
		});
    });

	//for showing main button when done
	const doneIds = [ 
		"s001_b001", "s001_b002", "s001_b003", 
		"s001_ss001_b001", "s001_ss001_b002", "s001_ss001_b003", "s001_ss001_b004", 
		"s002_ss001_b001", "s002_ss001_b002", "s002_ss001_b003", "s002_ss001_b004", 
		"s002_ss002_b001", "s002_ss002_b002", "s002_ss002_b003", "s002_ss002_b004", 
		"s002_ss003_b001", "s002_ss003_b002", "s002_ss003_b003", "s002_ss003_b004"
		];
		doneIds.forEach((id) => {
		document.getElementById(id)?.addEventListener('click', function () {
			if (document.getElementById(id).classList.contains('snap')) return;
			const elemId = id.split('_')[0];
			document.getElementById(elemId).style.display = "block";
		});
    });
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById("c001")?.addEventListener('click', function() {
		if (document.getElementById('c001').classList.contains('snap')) return;
		showCollection("c001");
	});

	document.getElementById("c002")?.addEventListener('click', function() {
		if (document.getElementById('c002').classList.contains('snap')) return;
		showCollection("c002");
	});

	document.getElementById("c003")?.addEventListener('click', function() {
		if (document.getElementById('c003').classList.contains('snap')) return;
		showCollection("c003");
	});
});
	
let btns_timeout;
let slideOpen = false;
let whichSlide;

const slideChildBtns = [ 
	"c001_b001", "c001_b002", "c001_b003", 
	"c002_b001", "c002_b002", "c002_b003", 
	"c003_b001", "c003_b002", "c003_b003"
];

slideChildBtns.forEach((id) => {
	const element = document.getElementById(id);
	if (element) {
		element.addEventListener('click', function () {
			if (btns_timeout) {
				clearTimeout(btns_timeout);
			}
			closeSlide();
		});
	}
});	

function showCollection(id) {
	const slideDivId = id + '_btns'
	const slideDiv = document.getElementById(slideDivId);
	if (slideOpen) {
		closeSlide();
	}
	slideDiv.classList.add('showit');
	slideDiv.classList.remove('hideit');
	slideOpen = true;
	whichSlide = slideDivId;
	if (btns_timeout) {
		clearTimeout(btns_timeout);
	}
	btns_timeout = setTimeout(closeSlide, 3000);
}

function closeSlide() {
	const openSlide = document.getElementById(whichSlide);
	openSlide.classList.remove('showit');
	openSlide.classList.add('hideit');
	slideOpen = false;
}

function resetSets() {
	document.getElementById('s001_btns').classList.remove('show');
	document.getElementById('s002_btns').classList.remove('show');
	document.getElementById('s001_ss001_btns').classList.remove('show');
	document.getElementById('s002_ss001_btns').classList.remove('show');
	document.getElementById('s002_ss002_btns').classList.remove('show');
	document.getElementById('s002_ss003_btns').classList.remove('show');
	document.getElementById('s001').style.display = "block";
	document.getElementById('s002').style.display = "block";
}