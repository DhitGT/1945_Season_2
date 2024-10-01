// Turret.js
import { GameState } from './GameState';

export class Turret {
  constructor(x, y, width, height, damage, range, fireRate, enemies, coins, color) {
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
    this.coins = coins;
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
      if (distance < closestDistance && enemy.isAlive) {
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
      const projectile = new Projectile(this.x, this.y, target.x, target.y, this.damage, this.enemies, this.coins);
      this.projectiles.push(projectile);
      this.lastFired = currentTime; // Update the last fired time
    }
  }

  // Method to update projectiles
  updateProjectiles(p) {
    for (let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];

      projectile.update(p)
      if (!projectile.alive) {
        this.projectiles.splice(i, 1)
      }
    }

  }



  // Method to draw the turret and its attack radius
  // Method to draw the turret and its attack radius
  draw(p) {
    // Save the current drawing style
    p.push();

    // Draw the turret
    p.fill(this.color); // Example color for the turret
    p.rect(this.x, this.y, this.width, this.height);

    // Check if the mouse is hovering over the turret
    if (p.mouseX > this.x && p.mouseX < this.x + this.width &&
      p.mouseY > this.y && p.mouseY < this.y + this.height) {

      // Draw the attack radius circle
      p.noFill(); // No fill for the circle
      p.stroke(255, 0, 0); // Red outline for the radius
      p.strokeWeight(2); // Outline thickness
      p.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.range * 2, this.range * 2); // Draw the circle
    }

    // Restore the previous drawing style
    p.pop();

    // Draw the projectiles
    this.projectiles.forEach(projectile => projectile.draw(p));
  }

}

// Projectile Class remains the same
class Projectile {
  constructor(x, y, targetX, targetY, damage, enemies, coins) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.speed = 5; // Projectile speed
    this.direction = this.calculateDirection(targetX, targetY);
    this.enemies = enemies
    this.coins = coins
    this.alive = true
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

    // console.log(this.enemies.length)

    for (let i = 0; i < this.enemies.length; i++) {
      let enemy = this.enemies[i]
      if (this.collidesWith(enemy)) {
        console.log("colldesss")
        enemy.takeDamage(this.damage)
        this.alive = false;


      }
      if (!enemy.isAlive && !enemy.droppedCoin) {
        this.coins.push(enemy.dropCoin(this.coins.length)) // Assuming dropCoin method returns a coin
      }
    }
  }

  collidesWith(enemy) {

    return (
      this.x < enemy.x + enemy.width &&
      this.x + 5 > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + 5 > enemy.y
    );
  }

  // Draw the projectile
  draw(p) {
    if (this.alive) {
      p.push();
      p.fill(255, 255, 0); // Example color for the projectile
      p.ellipse(this.x, this.y, 5, 5); // Draw as a circle
      p.pop();
    }
  }
}
