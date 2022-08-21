let gravitationalConstant = 1;
let velMulti = 0.1;
let numIterations = 850;

function awakeBodies() {
    for(const body of celestialBodies) {
        body.awake();
    }
}

function returnBodiesInitState() {
    for(const body of celestialBodies) {
        body.asleep = true;
        body.collided = false;
        body.velocity = createVector(0, 0);
        body.position = createVector(body.initPosition.x, body.initPosition.y);
    }
    previewBodiesPath(numIterations);
}

function updateBodies() {
    let collisionRecord = new Array();
    let i = 0;
    
    for(const body of celestialBodies) {
        body.updateVelocity(celestialBodies);
        if(body.collided) {
            if (!collisionRecord.includes(i)) {
                collisionRecord.push(i);
            }
        } else {
            body.updatePosition();
            body.render();
        }
        i++;
    }

    for(const index of collisionRecord) {
        collidedBodies.push(new CollidedBody(celestialBodies[index].radius, celestialBodies[index].position));
    }
}

function previewBodiesPath(it) {
    if(celestialBodies.length + stars.length > 0) {
        let previewBodies = new Array();
        let collisionRecord = new Array();
        collidedBodies = [];
        previewPaths = [];
        previewColors = [];

        for(const body of celestialBodies) {
            let position = createVector(body.position.x, body.position.y);
            let initVelocity = createVector(body.initVelocity.x, body.initVelocity.y);

            previewBodies.push(new PreviewBody(body.mass, body.radius, position, initVelocity));
            previewPaths.push(new Array());
            previewColors.push(body.color);
        }
        
        for(let i = 0; i < it; i++) {
            for(let j = 0; j < previewBodies.length; j++) {
                previewBodies[j].updateVelocity(previewBodies);
                if(previewBodies[j].collided) {
                    if (!collisionRecord.includes(j)) {
                        collisionRecord.push(j);
                    }
                } else {
                    previewBodies[j].updatePosition();
                    previewPaths[j].push(createVector(previewBodies[j].position.x, previewBodies[j].position.y));
                }
            }
        }

        for(const index of collisionRecord) {
            collidedBodies.push(new CollidedBody(previewBodies[index].radius, previewBodies[index].position));
        }
    }
}