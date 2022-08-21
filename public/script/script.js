let celestialBodies = new Array();
let stars = new Array();
let selectedBody = -1;
let selectedStar = -1;
let dragElem = false;
let isSimulating = false;
let disableInput = true;
let controlsVisible = true;
let presetVisible = false;
let advSetVisible = false;
let starSelected = false;
let starLighting = true;

// ------------------- Mouse Input Handler -------------------

function mousePressed() {
    if(mouseY > 90 && !disableInput) {
        if(mouseY < 460 && mouseX > windowWidth - 250 && controlsVisible) {
            return;
        }

        if(mouseY < 360 && mouseX < 250 && advSetVisible) {
            return;
        }
        
        dragElem = true;

        // Grab existing celestial body
        for(let i = 0; i < celestialBodies.length; i++) {
            if(dist(celestialBodies[i].position.x, celestialBodies[i].position.y, mouseX, mouseY) < celestialBodies[i].radius) {
                if(selectedStar > -1) {
                    selectedStar = -1;
                }
                
                if(selectedBody != i) {
                    selectObject(i);

                    if(!controlsVisible) {
                        toggleControls();
                    }
                }

                selectedBody = i;
                return;
            }
        }

        // Grab existing star
        for(let i = 0; i < stars.length; i++) {
            if(dist(stars[i].position.x, stars[i].position.y, mouseX, mouseY) < stars[i].radius) {
                if(selectedBody > -1) {
                    celestialBodies[selectedBody].selected = false;
                    selectedBody = -1;
                }

                selectedStar = i;
                return;
            }
        }
        
        if(starSelected) {
            // Create new star
            stars.push(new Star(createVector(mouseX, mouseY)));
            
            if(selectedBody > -1) {
                celestialBodies[selectedBody].selected = false;
                selectedBody = -1;
            }

            selectedStar = stars.length - 1;
        } else {
            // Create new celestial body
            celestialBodies.push(new CelestialBody(colorSelector.value, Number(inputMass.value), Number(inputRadius.value), createVector(mouseX, mouseY), createVector(Number(inputVelX.value), Number(inputVelY.value))));
            
            if(selectedStar > -1) {
                selectedStar = -1;
            }
            
            if(selectedBody > -1) {
                celestialBodies[selectedBody].selected = false;
            }
            selectedBody = celestialBodies.length - 1;

            if(!controlsVisible) {
                toggleControls();
            }
        }

        previewBodiesPath(numIterations);
    }
}
  
function mouseDragged() {
    if(dragElem) {
        selectedBody > -1 ? celestialBodies[selectedBody].setPosition(mouseX, mouseY) : stars[selectedStar].setPosition(mouseX, mouseY);
        previewBodiesPath(numIterations);
    }
}

function mouseReleased() {
    dragElem = false;
}

// -------------------------------------------------------------

function deleteObject() {
    if(selectedBody > -1) {
        celestialBodies.splice(selectedBody, 1);
        selectedBody = -1;
    }

    if(selectedStar > -1) {
        stars.splice(selectedStar, 1);
        selectedStar = -1;
    }

    if(!burger.classList.contains('toggle')) {
        toggleControls();
    }

    previewBodiesPath(numIterations);
}

// ---------------- Help Dialog Box Presentation ----------------

const helpDialog = document.querySelector('.help-dlg');
let helpPageNum = 1;

function toggleHelp() {
    disableInput = isSimulating || presetVisible ? disableInput : !disableInput;
    helpDialog.classList.toggle('hidden');
}

function changePage(forward) {
    if(forward ? helpPageNum == 9 : helpPageNum == 1) {
        return;
    }
    
    const prevPage = document.getElementById('page-' + helpPageNum);
    prevPage.classList.add('hidden');

    forward ? helpPageNum++ : helpPageNum--;

    const currPage = document.getElementById('page-' + helpPageNum);
    currPage.classList.remove('hidden');

    updatePageHeader();
    checkPageNum();
}

function updatePageHeader() {
    const count = document.getElementById('page-count');
    count.innerHTML = helpPageNum + "/9";
}

function checkPageNum() {
    const prev = document.getElementById('help-prev');
    const next = document.getElementById('help-next');
    
    switch(helpPageNum) {
        case 1:
            prev.classList.add('hidden-arrow');
            break;
        case 9:
            next.classList.add('hidden-arrow');
            break;
        default:
            if(controlsVisible && helpDialog != 2) {
                toggleControls();
            }

            if(prev.classList.contains('hidden-arrow')) {
                prev.classList.remove('hidden-arrow');
            }    
            if(next.classList.contains('hidden-arrow')) {
                next.classList.remove('hidden-arrow');
            }
    }
}

// ------------ Celestial Body Properties Controls ------------

const colorSelector = document.getElementById("color-select");

colorSelector.oninput = function() {
    if(selectedBody != -1) {
        celestialBodies[selectedBody].color = this.value;
        updatePathColor();
    }
}

const sliderMass = document.getElementById("massSlider");
const inputMass = document.getElementById("massInput");

sliderMass.oninput = function() {
    inputMass.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].mass = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

inputMass.oninput = function() {
    sliderMass.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].mass = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

const sliderRadius = document.getElementById("radiusSlider");
const inputRadius = document.getElementById("radiusInput");

sliderRadius.oninput = function() {
    inputRadius.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].radius = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

inputRadius.oninput = function() {
    inputRadius.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].radius = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

const sliderVelX = document.getElementById("velXSlider");
const inputVelX = document.getElementById("velXInput");

sliderVelX.oninput = function() {
    inputVelX.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].initVelocity.x = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

inputVelX.oninput = function() {
    sliderVelX.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].initVelocity.x = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

const sliderVelY = document.getElementById("velYSlider");
const inputVelY = document.getElementById("velYInput");

sliderVelY.oninput = function() {
    inputVelY.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].initVelocity.y = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

inputVelY.oninput = function() {
    sliderVelY.value = this.value;
    if(selectedBody != -1) {
        celestialBodies[selectedBody].initVelocity.y = Number(this.value);
        previewBodiesPath(numIterations);
    }
}

// -------------------------------------------------------------

function selectObject(i) {
    if(selectedBody > -1) {
        celestialBodies[selectedBody].selected = false;
    }
    celestialBodies[i].selected = true;
    colorSelector.value = celestialBodies[i].color;
    inputMass.value = celestialBodies[i].mass;
    sliderMass.value = celestialBodies[i].mass;
    inputRadius.value = celestialBodies[i].radius;
    sliderRadius.value = celestialBodies[i].radius;
    inputVelX.value = celestialBodies[i].initVelocity.x;
    sliderVelX.value = celestialBodies[i].initVelocity.x;
    inputVelY.value = celestialBodies[i].initVelocity.y;
    sliderVelY.value = celestialBodies[i].initVelocity.y;
}

// ------------------- Nav Bar Functionality -------------------

const burger = document.querySelector('.burger');
const controls = document.querySelector('.controls');
const simulateBtn = document.getElementById('sml-btn');
const preBtn = document.getElementById('pre-btn');
const preDlg = document.querySelector('.preset-dlg');
const advBtn = document.getElementById('adv-btn');
const advSet = document.querySelector('.adv-settings');
const planetBtn = document.getElementById('btn-planet');
const starBtn = document.getElementById('btn-star');
const advArrow = document.querySelector('.body-slc-btn .fa-caret-down');

function toggleControls() {
    controls.classList.toggle('controls-hidden');
    burger.classList.toggle('toggle');
    controlsVisible = !controlsVisible;
}

function beginSimulation() {
    isSimulating = true;

    advBtn.disabled = true;
    preBtn.disabled = true;

    if(!helpDialog.classList.contains('hidden')) {
        toggleHelp();
    }

    if(presetVisible) {
        displayPreset();
    }

    disableInput = true;
    simulateBtn.style.display = 'none';

    if(selectedBody > -1) {
        celestialBodies[selectedBody].selected = false;
    }
    selectedBody = -1;
    collidedBodies = [];

    if(!burger.classList.contains('toggle')) {
        toggleControls();
    }

    if(advSetVisible) {
        displayAdvSet();
    }

    awakeBodies();
}

function stopSimulation() {
    isSimulating = false;

    advBtn.disabled = false;
    preBtn.disabled = false;

    disableInput = presetVisible ? true : false;
    simulateBtn.style.display = 'unset';
    returnBodiesInitState();

    if(!burger.classList.contains('toggle')) {
        toggleControls();
    }
}

function reset() {
    selectedBody = -1;
    selectedStar = -1;

    celestialBodies = [];
    stars = [];
    previewPaths = [];
    collidedBodies = [];
    previewColors = [];

    stopSimulation();
}

function displayAdvSet() {
    advBtn.classList.toggle('adv-selected');
    advSet.classList.toggle('adv-hidden');
    advArrow.classList.toggle('adv-arrow-up');
    advSetVisible = !advSetVisible;
}

function displayPreset() {
    preBtn.classList.toggle('adv-selected');
    preDlg.classList.toggle('hidden');
    presetVisible = !presetVisible;
    disableInput = presetVisible || !helpDialog.classList.contains('hidden') ? true : false;
}

function selectPlanet() {
    if(starSelected) {
        starSelected = false;
        toggleSelectBtns();
        if(!controlsVisible) {
            toggleControls();
        }
    }
}

function selectStar() {
    if(!starSelected) {
        starSelected = true;
        toggleSelectBtns();
        if(controlsVisible) {
            toggleControls();
        }
    }
}

function toggleSelectBtns() {
    planetBtn.classList.toggle('btn-selected');
    starBtn.classList.toggle('btn-selected');
}

// -------------------- Advanced Settings --------------------

const inputG = document.getElementById("g-const");

inputG.oninput = function() {
    gravitationalConstant = Number(this.value);
    previewBodiesPath(numIterations);
}

const inputVelMult = document.getElementById("vel-mult");

inputVelMult.oninput = function() {
    velMulti = Number(this.value);
    previewBodiesPath(numIterations);
}

const inputIt = document.getElementById("prev-it");

inputIt.oninput = function() {
    numIterations = Number(this.value);
    previewBodiesPath(numIterations);
}

const selectStarLight = document.getElementById("star-light");

selectStarLight.oninput = function() {
    starLighting = this.value === 'true';
}

// -------------------------------------------------------------

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 45) {
        return false;
    }
    return true;
}

function isPosNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isFloat(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 45) {
        return false;
    }
    return true;
}