let offsetX = 0;
let offsetY = 0;
let initialLeft = 0;
let initialTop = 0;
let lastMoveTime = 0;
let disEditDrag = false;
let toggleSwitchesHeaderDrag = false;

document.addEventListener('DOMContentLoaded', () => {
    const disEdit = document.getElementById("disEdit");
    const shadowShape = document.getElementById("shadowShape");
    const dragBar = document.getElementById("dragBar");
    const toggleSwitchesHeader = document.getElementById("toggleSwitchesHeader");
    const shadowToggle = document.getElementById("shadowToggle");
    const toggleDrag = document.getElementById("toggleDrag");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const target = mutation.target;
            if (!target.id) return;
            if (!disEdit.classList.contains("show") && !toggleSwitchesHeader.classList.contains("show")) {
                if (target.classList.contains("snap")) {
                    makeElementDraggable(target);
                } else if (!target.classList.contains("snap")) {
                    interact(target).unset();
                    target.style.cursor = "default";
                }
            }
            if (target.id === "disEdit") {
                if (target.classList.contains("show")) {
                    applyDisEditToShadow();
                    makeElementDraggable(dragBar);
                } else {
                    interact(dragBar).unset();
                }
            }
            if (target.id === "toggleSwitchesHeader") {
                if (target.classList.contains("show") && !toggleSwitchesHeaderDrag) {
                    applyHeaderToShadow();
                    makeElementDraggable(toggleDrag);
                } else {
                    interact(toggleDrag).unset();
                }
            }
            
        });
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
    document.addEventListener("click", (event) => {
        if (event.target === shadowShape && shadowShape.classList.contains("show")) {
            shadowShape.classList.remove("show");
        }
        if (event.target === shadowToggle && shadowToggle.classList.contains("show")) {
            shadowToggle.classList.remove("show");
        }
    });
    
    function makeElementDraggable(element) {
        interact(element).draggable({
            modifiers: [
                interact.modifiers.snap({
                    targets: [
                        (x, y) => {
                            const snapX = Math.round(x / 10) * 10;
                            const snapY = Math.round(y / 10) * 10;
                            return { x: snapX, y: snapY };
                        }
                    ],
                    range: 10,
                }),
            ],
            listeners: {
                start(event) {
                    const dragTarget = getDragTarget(event);
                    const rect = dragTarget.getBoundingClientRect();
                    const scale = getScale(); // ← helper function defined below
                    offsetX = (event.clientX - rect.left) / scale;
                    offsetY = (event.clientY - rect.top) / scale;
                },
                move(event) {
                    const scale = getScale();
                    const dragTarget = getDragTarget(event, false);
                    const newLeft = getFinalNum(dragTarget.id, (event.clientX / scale - offsetX), 'left');
                    const newTop = getFinalNum(dragTarget.id, (event.clientY / scale - offsetY), 'top');
                    dragTarget.style.left = `${newLeft}px`;
                    dragTarget.style.top = `${newTop}px`;
                },
                end(event) {
                    const dragTarget = getDragTarget(event);
                    const elementId = dragTarget.id;
                    const tempFinalLeft = parseFloat(dragTarget.style.left || 0);
                    const tempFinalTop = parseFloat(dragTarget.style.top || 0);
                    const finalLeft = getFinalNum(elementId, tempFinalLeft);
                    const finalTop = getFinalNum(elementId, tempFinalTop);
                    dragTarget.style.left = `${finalLeft}px`;
                    dragTarget.style.top = `${finalTop}px`;
                    if (dragTarget.classList.contains("show")) {
                        dragTarget.classList.remove("show");
                    }
                },
            },
        });
    }
});

function getScale() {
	const transform = getComputedStyle(document.body).transform;
	if (!transform || transform === 'none') return 1;
	const match = transform.match(/matrix\(([^,]+)/);
	return match ? parseFloat(match[1]) : 1;
}

function getDragTarget(event, apply = true) {
    const shadowShape = document.getElementById("shadowShape");
    const shadowToggle = document.getElementById("shadowToggle");
    let dragTarget;
    if (event.target.id === "dragBar") {
        if (apply) applyShadowToDisEdit();
        return shadowShape;
    } else if (event.target.id === "toggleDrag") {
        if (apply) applyToggleToHeader();
        return shadowToggle;
    } else {
        return event.target;
    }
}

function applyDisEditToShadow() {
    const disEdit = document.getElementById("disEdit");
    const shadowShape = document.getElementById("shadowShape");
    const computedStyle = window.getComputedStyle(disEdit);
    if (areStylesEqual(shadowShape, disEdit)) return;
    shadowShape.style.top = computedStyle.top;
    shadowShape.style.left = computedStyle.left;
    shadowShape.style.width = computedStyle.width;
    shadowShape.style.height = computedStyle.height;
}

function applyShadowToDisEdit() {
    const disEdit = document.getElementById("disEdit");
    const shadowShape = document.getElementById("shadowShape");
    const computedStyle = window.getComputedStyle(shadowShape);
    disEdit.style.top = computedStyle.top;
    disEdit.style.left = computedStyle.left;
}

function applyHeaderToShadow() { 
    const toggleSwitchesHeader = document.getElementById("toggleSwitchesHeader");
    const shadowToggle = document.getElementById("shadowToggle");
    const computedStyle = window.getComputedStyle(toggleSwitchesHeader);
    if (areStylesEqual(shadowToggle, toggleSwitchesHeader)) return;
    shadowToggle.style.top = computedStyle.top;
    shadowToggle.style.left = computedStyle.left;
    shadowToggle.style.width = computedStyle.width;
    shadowToggle.style.height = computedStyle.height;
}

function applyToggleToHeader() {
    const toggleSwitchesHeader = document.getElementById("toggleSwitchesHeader");
    const shadowToggle = document.getElementById("shadowToggle");
    const computedStyle = window.getComputedStyle(shadowToggle);
    toggleSwitchesHeader.style.top = computedStyle.top;
    toggleSwitchesHeader.style.left = computedStyle.left;
}

function areStylesEqual(element1, element2) {
    if (
        element1.style.top === element2.style.top &&
        element1.style.left === element2.style.left &&
        element1.style.width === element2.style.width &&
        element1.style.height === element2.style.height
    );
}

function getFinalNum(buttonId, value, type = null) {
	const scale = getScale();
	const element = document.getElementById(buttonId);
	const rect = element.getBoundingClientRect();
	const width = rect.width / scale;
	const height = rect.height / scale;
	const viewportWidth = window.innerWidth / scale;
	const viewportHeight = window.innerHeight / scale;
	const lastDigit = Math.abs(value) % 10;
	let result = lastDigit > 4 ? value + (10 - lastDigit) : value - lastDigit;
	if (type === null) return result;
	if (result < 0) return 0;
	if (type === 'left' && result > viewportWidth - width) {
		return viewportWidth - width;
	} else if (type === 'top' && result > viewportHeight - height) {
		return viewportHeight - height;
	} else {
		return result;
	}
}

function showShadowShape() {
    document.getElementById("shadowShape").classList.add("show");
}

function showShadowToggle() {
    document.getElementById("shadowToggle").classList.add("show");
}

function addDragListeners() {
    document.getElementById("dragBar").addEventListener("mousedown", showShadowShape);
    document.getElementById("toggleDrag").addEventListener("mousedown", showShadowToggle);
}

function removeDragListeners() {
    document.getElementById("dragBar").removeEventListener("mousedown", showShadowShape);
    document.getElementById("toggleDrag").removeEventListener("mousedown", showShadowToggle);
}

addDragListeners();