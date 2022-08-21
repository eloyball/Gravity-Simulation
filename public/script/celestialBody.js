class CelestialBody {
    constructor(color, mass, radius, position, initVelocity) {
      this.color = color;
      this.mass = mass;
      this.radius = radius;
      this.initPosition = createVector(position.x, position.y);
      this.position = position;
      this.initVelocity = initVelocity;
      this.velocity = createVector(0, 0);
      this.asleep = true;
      this.selected = true;
      this.collided = false;
    }
  
    awake() {
      this.velocity = p5.Vector.mult(this.initVelocity, velMulti);
      this.asleep = false;
    }
  
    setPosition(x, y) {
      this.position.x = x;
      this.position.y = y;
      this.initPosition.x = x;
      this.initPosition.y = y;
    }
  
    updatePosition() {
      this.position.add(this.velocity);
    }

    updateVelocity(allBodies) {
      if(!this.asleep) {
        // Calculate for Stars
        for(const star of stars) {
          // ====== | F = G * (m1 * m2) / r^2 | ======
          let direction = p5.Vector.sub(star.position, this.position);
          let force = p5.Vector.normalize(direction);
          let sqrDist = direction.magSq();
          let strength = gravitationalConstant * this.mass * star.mass / sqrDist;
          force.setMag(strength);
          // =========================================
          let acceleration = p5.Vector.div(force, this.mass);
          this.velocity.add(acceleration);

          // Check for collision
          if(Math.sqrt(sqrDist) <= this.radius + star.radius) {
            this.collided = true;
          }
        }

        // Calculate for other Celestial Bodies
        for(const otherBody of allBodies) {
          if(otherBody != this) {
            // ====== | F = G * (m1 * m2) / r^2 | ======
            let direction = p5.Vector.sub(otherBody.position, this.position);
            let force = p5.Vector.normalize(direction);
            let sqrDist = direction.magSq();
            let strength = gravitationalConstant * this.mass * otherBody.mass / sqrDist;
            force.setMag(strength);
            // =========================================
            let acceleration = p5.Vector.div(force, this.mass);
            this.velocity.add(acceleration);

            // Check for collision
            if(Math.sqrt(sqrDist) <= this.radius + otherBody.radius) {
              this.collided = true;
            }
          }
        }
      }
    }

    render() {    
      const starsPresent = stars.length > 0;
      const fillColor = starsPresent && starLighting ? colors.shadowColors.get(this.color) : colors.baseColors.get(this.color);
      
      // Draw Circle
      push();
      this.selected && this.asleep ? stroke(255) : noStroke();
      strokeWeight(2);
      fill(fillColor.x, fillColor.y, fillColor.z);
      ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
      pop();

      if(starsPresent && starLighting) {
        this.renderHighlights();
      }

      // Draw Initial Velocity Arrow
      if(this.asleep) {
        if(this.initVelocity.x != 0 || this.initVelocity.y != 0) {
          push();
          let velArrowV = createVector((this.position.x + this.initVelocity.x), (this.position.y + this.initVelocity.y));
          stroke(255);
          strokeWeight(3);
          line(this.position.x, this.position.y, velArrowV.x, velArrowV.y);
          let arrowSize = Math.min(5, p5.Vector.dist(this.position, velArrowV) * 0.3);
          let angle = atan2(velArrowV.y - this.position.y, velArrowV.x - this.position.x);
          translate(velArrowV.x, velArrowV.y);
          rotate(angle);
          triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
          pop();
        }
      }
    }

    renderHighlights() {
      const hColor = colors.baseColors.get(this.color);
      
      for(const star of stars) {
        let direction = p5.Vector.sub(star.position, this.position);
        let dist = direction.mag();
        let k = (this.radius * 0.75) / dist;
        direction.mult(k);
        let x = this.position.x + direction.x;
        let y = this.position.y + direction.y;

        push();
        radialGradient(
          x, y, 0,
          x, y, this.radius * 1.75,
          color(hColor.x, hColor.y, hColor.z), 0,
          color(hColor.x, hColor.y, hColor.z, 0), 1
        );
        noStroke();
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        pop();
      }
    }
}

class PreviewBody {
  constructor(mass, radius, position, initVelocity) {
    this.mass = mass;
    this.radius = radius;
    this.position = position;
    this.velocity = initVelocity.mult(velMulti);
    this.collided = false;
  }

  updatePosition() {
    this.position.add(this.velocity);
  }

  updateVelocity(allBodies) {
    // Calculate for Stars
    for(const star of stars) {
      // ====== | F = G * (m1 * m2) / r^2 | ======
      let direction = p5.Vector.sub(star.position, this.position);
      let force = p5.Vector.normalize(direction);
      let sqrDist = direction.magSq();
      let strength = gravitationalConstant * this.mass * star.mass / sqrDist;
      force.setMag(strength);
      // =========================================
      let acceleration = p5.Vector.div(force, this.mass);
      this.velocity.add(acceleration);

      // Check for collision
      if(Math.sqrt(sqrDist) <= this.radius + star.radius) {
        this.collided = true;
      }
    }

    // Calculate for other Celestial Bodies
    for(const otherBody of allBodies) {
      if(otherBody != this) {
        // ====== | F = G * (m1 * m2) / r^2 | ======
        let direction = p5.Vector.sub(otherBody.position, this.position);
        let force = p5.Vector.normalize(direction);
        let sqrDist = direction.magSq();
        let strength = gravitationalConstant * this.mass * otherBody.mass / sqrDist;
        force.setMag(strength);
        // =========================================
        let acceleration = p5.Vector.div(force, this.mass);
        this.velocity.add(acceleration);

        // Check for collision
        if(Math.sqrt(sqrDist) <= this.radius + otherBody.radius) {
          this.collided = true;
        }
      }
    }
  }
}

class CollidedBody {
  constructor(radius, position) {
    this.radius = radius;
    this.position = position;
  }

  render() {
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    pop();
  }
}

class Star {
  constructor(position) {
    this.position = position;
    this.mass = 10000;
    this.radius = 50;
    this.glow = 250;
    this.selected = true;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  render() {    
    push();
    radialGradient(
      this.position.x, this.position.y, 0,
      this.position.x, this.position.y, this.glow,
      color(255, 200, 0), 0,
      color(0, 0), 0.5
    );
    noStroke();
    ellipse(this.position.x, this.position.y, this.glow, this.glow);
    pop();

    push();
    radialGradient(this.position.x, this.position.y, 0,
      this.position.x, this.position.y, this.radius * 2,
      color(255, 255, 200), 0,
      color(255, 255, 0), 1
    );
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    pop();
  }
}