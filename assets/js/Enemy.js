import { Entity } from './Entity';
import { Coin } from './Coin'; // Import the Coin class

export class Enemy extends Entity {
  constructor(enemies, index, x, y, width, height, speed, hp, turrets) {
    super(x, y, width, height);
    this.speed = speed;
    this.hp = hp; // Initialize enemy health points
    this.maxHp = hp;
    this.isAlive = true; // Flag to track if the enemy is alive
    this.droppedCoin = false;
    this.enemies = enemies;
    this.index = index;
    this.turrets = turrets; // Array of turrets to find the nearest one
    this.target = null; // The target (turret or player) the enemy will attack
    this.attackRange = 50; // Range for attacking
  }

  followTarget(target) {
    const targetX = target.x;
    const targetY = target.y;

    // Simple movement towards the target
    if (this.x < targetX) {
      this.x += this.speed; // Move right
    } else if (this.x > targetX) {
      this.x -= this.speed; // Move left
    }

    if (this.y < targetY) {
      this.y += this.speed; // Move down
    } else if (this.y > targetY) {
      this.y -= this.speed; // Move up
    }

  }

  // Method to find the nearest turret and player
  findNearestTarget(player) {
    let closestDistance = Infinity;
    this.target = null;

    for (const turret of this.turrets) {
      const dx = turret.x - this.x;
      const dy = turret.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        this.target = turret;
      }
    }


    const playerDx = player.x - this.x;
    const playerDy = player.y - this.y;
    const playerDistance = Math.sqrt(playerDx * playerDx + playerDy * playerDy);


    if (playerDistance < closestDistance) {
      this.target = player; 
    }
  }

  moveToTarget() {
    if (this.target) {
      const targetX = this.target.x + this.target.width / 2; // Center of the target
      const targetY = this.target.y + this.target.height / 2;

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.attackRange) {
        // Normalize direction and move towards the target
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      } else {
        // If close enough, stop moving and shoot
        this.shoot();
      }
    }
  }

  // Method to shoot at the target
  shoot() {
    // Implement shooting logic (e.g., create bullets targeting the current target)
    console.log('Shooting at:', this.target);
  }

  // Update method to handle enemy behavior
  update(player) {
    if (this.isAlive) {
      this.findNearestTarget(player); // Find the nearest target each update
      this.moveToTarget(); // Move towards the selected target
    }
  }

  collidesWith(bullet) {
    return (
      this.x < bullet.x + bullet.width &&
      this.x + this.width > bullet.x &&
      this.y < bullet.y + bullet.height &&
      this.y + this.height > bullet.y
    );
  }

  // Method to take damage from bullets
  takeDamage(amount) {
    if (this.isAlive) {
      this.hp -= amount; // Reduce HP by the damage amount
      if (this.hp <= 0) {
        this.die();
      }
    }
  }

  // Handle enemy death
  die() {
    this.isAlive = false;
    this.enemies.splice(this.index, 1);
    // this.dropCoin(); // Drop a coin when the enemy dies
  }

  // Draw the HP bar above the enemy
  drawHPBar(p) {
    const hpBarWidth = this.width; // Width of the HP bar
    const hpBarHeight = 5; // Height of the HP bar
    const hpRatio = this.hp / this.maxHp; // Assuming max HP is 100

    // Draw background
    p.fill(0, 0, 0, 150); // Semi-transparent black for background
    p.rect(this.x, this.y - 10, hpBarWidth, hpBarHeight); // Position above the enemy

    // Draw current HP
    p.fill(255, 0, 0); // Red for the HP bar
    p.rect(this.x, this.y - 10, hpBarWidth * hpRatio, hpBarHeight); // Draw based on current HP
  }

  // Draw the enemy
  draw(p) {
    if (this.isAlive) {
      p.fill(255); // White color for the enemy
      p.rect(this.x, this.y, this.width, this.height); // Draw enemy rectangle
      this.drawHPBar(p); // Draw the HP bar
    }
  }


}
