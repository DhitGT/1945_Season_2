// Turret.js
export class Turret {
  constructor(x, y, width, height, damage, range, fireRate, enemies, color) {
    this.x = x; // X position of the turret
    this.y = y; // Y position of the turret
    this.width = width; // Width of the turret
    this.height = height; // Height of the turret
    this.damage = damage; // Damage dealt by the turret
    this.range = range; // Attack range of the turret
    this.fireRate = fireRate; // Fire rate of the turret
    this.lastFired = 0; // Time since last shot
    this.projectiles = []; // Array to hold the fired projectiles
    this.enemies = enemies;
    this.color = color;
  }

  // Method to update turret behavior (e.g., shooting)
  update(p) {
    const closestEnemy = this.findClosestEnemy();

    if (closestEnemy) {
      console.log("isclosee")
      this.shootAt(closestEnemy, p);
    }

    // Update projectiles
    this.updateProjectiles(p);
  }

  setPosition(x, y) {
    this.x = x
    this.y = y
  }

  // Method to find the closest enemy within range
  findClosestEnemy() {
    let closest = null;
    let closestDistance = this.range;

    this.enemies.forEach(enemy => {
      const distance = this.calculateDistance(enemy);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = enemy;
      }
    });

    return closest;
  }

  // Method to calculate distance to an enemy
  calculateDistance(enemy) {
    return Math.sqrt(
      (this.x - enemy.x) ** 2 + (this.y - enemy.y) ** 2
    );
  }

  // Method to shoot at the target enemy
  shootAt(target, p) {
    const currentTime = p.millis(); // Get current time in milliseconds
    if (currentTime - this.lastFired >= this.fireRate) {
      // Create a projectile towards the target
      const projectile = new Projectile(this.x, this.y, target.x, target.y, this.damage);
      this.projectiles.push(projectile);
      this.lastFired = currentTime; // Update the last fired time
    }
  }

  // Method to update projectiles
  updateProjectiles(p) {
    this.projectiles.forEach(projectile => projectile.update(p));
  }

  // Method to draw the turret and its attack radius
  // Method to draw the turret and its attack radius
  draw(p) {
    // Save the current drawing style
    p.push();

    // Draw the turret
    p.fill(this.color); // Example color for the turret
    p.rect(this.x, this.y, this.width, this.height);

    // Draw the attack radius circle
    p.noFill(); // No fill for the circle
    p.stroke(255, 0, 0); // Red outline for the radius
    p.strokeWeight(2); // Outline thickness
    p.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.range * 2, this.range * 2); // Draw the circle

    // Restore the previous drawing style
    p.pop();

    // Draw the projectiles
    this.projectiles.forEach(projectile => projectile.draw(p));
  }

}

// Projectile Class remains the same
class Projectile {
  constructor(x, y, targetX, targetY, damage) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.speed = 5; // Projectile speed
    this.direction = this.calculateDirection(targetX, targetY);
  }

  // Calculate direction vector towards the target
  calculateDirection(targetX, targetY) {
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  // Update projectile position
  update(p) {
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
  }

  // Draw the projectile
  draw(p) {
    p.push();
    p.fill(255, 255, 0); // Example color for the projectile
    p.ellipse(this.x, this.y, 5, 5); // Draw as a circle
    p.pop();
  }
}
