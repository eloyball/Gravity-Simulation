class Preset {
    list = new Map([
        ['TWO BODIES', [
            new CelestialBody('red', 1200, 20, createVector(windowWidth/2 + 100, windowHeight/2 + 45), createVector(0, 20.8)),
            new CelestialBody('blue', 1200, 20, createVector(windowWidth/2 - 100, windowHeight/2 + 45), createVector(0, -20.8))
        ]],
    
        ['THREE BODIES', [
            new CelestialBody('orange', 400, 20, createVector(windowWidth/2, windowHeight/2), createVector(0.93240737 * 10, 0.86473146 * 10)),
            new CelestialBody('blue', 400, 20, createVector(windowWidth/2 + 0.97000436 * 400, windowHeight/2 - 0.24308753 * 400), createVector(-0.93240737 * 10 / 2, -0.86473146 * 10 / 2)),
            new CelestialBody('red', 400, 20, createVector(windowWidth/2 - 0.97000436 * 400, windowHeight/2 + 0.24308753 * 400), createVector(-0.93240737 * 10 / 2, -0.86473146 * 10 / 2))
        ]],
    
        ['SOLAR SYSTEM', [
            new Star(createVector(windowWidth/2, windowHeight/2 + 45)),
            new CelestialBody('gray', 1, 8, createVector(windowWidth/2 + 100, windowHeight/2 + 45), createVector(0, 100)),
            new CelestialBody('orange', 1, 12, createVector(windowWidth/2 + 150, windowHeight/2 + 45), createVector(0, 81.650)),
            new CelestialBody('blue', 1, 12, createVector(windowWidth/2 + 200, windowHeight/2 + 45), createVector(0, 70.711)),
            new CelestialBody('red', 1, 10, createVector(windowWidth/2 + 250, windowHeight/2 + 45), createVector(0, 63.246)),
            new CelestialBody('purple', 1, 20, createVector(windowWidth/2 + 300, windowHeight/2 + 45), createVector(0, 57.735)),
            new CelestialBody('yellow', 1, 15, createVector(windowWidth/2 + 350, windowHeight/2 + 45), createVector(0, 53.452)),
            new CelestialBody('green', 1, 18, createVector(windowWidth/2 + 400, windowHeight/2 + 45), createVector(0, 50))
        ]],
    
        ['SUN EARTH MOON', [
            new Star(createVector(windowWidth/2, windowHeight/2 + 45)),
            new CelestialBody('gray', 0.01, 9, createVector(windowWidth/2 + 290, windowHeight/2 + 45), createVector(0, -18.4)),
            new CelestialBody('blue', 3000, 16, createVector(windowWidth/2 + 350, windowHeight/2 + 45), createVector(0, 53.452))
        ]],
    
        ['SQUARE', [
            new Star(createVector(windowWidth/2, windowHeight/2 + 45)),
            new CelestialBody('purple', 1000, 15, createVector(windowWidth/2 + 300, windowHeight/2 + 45), createVector(0, 57.735)),
            new CelestialBody('yellow', 0.001, 10, createVector(windowWidth/2 + 233, windowHeight/2 + 45), createVector(0, 98.514))
        ]],
    
        ['HEXAGON', [
            new Star(createVector(windowWidth/2, windowHeight/2 + 45)),
            new CelestialBody('purple', 1000, 15, createVector(windowWidth/2 + 300, windowHeight/2 + 45), createVector(0, 57.735)),
            new CelestialBody('yellow', 0.001, 10, createVector(windowWidth/2 + 253.333, windowHeight/2 + 45), createVector(0, 104.703))
        ]]
    ]);
}

function selectPreset(key) {
    reset();

    const newArray = presets.list.get(key);

    for(const object of presets.list.get(key)) {
        console.log(object);
    }

    // for(const object of newArray) {
    //     if(object instanceof Star) {
    //         stars.push(object);
    //         continue;
    //     }

    //     if(object instanceof CelestialBody) {
    //         object.selected = false;
    //         celestialBodies.push(object);
    //     }
    // }
}

function initPreset() {
    const presetList = document.getElementById("preset-list");

    presets.list.forEach((value, key) => {
        let itemBtn = document.createElement("button");
        itemBtn.classList.add("preset-btn");
        itemBtn.innerHTML = key;
        itemBtn.onclick = function selectPreset() {
            reset();
        
            for(const object of value) {
                if(object instanceof Star) {
                    stars.push(object);
                    continue;
                }
        
                if(object instanceof CelestialBody) {
                   object.selected = false;
                    celestialBodies.push(object);
                }
            }

            previewBodiesPath(numIterations);
        };

        presetList.append(itemBtn);
    });
}