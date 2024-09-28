import { Entity } from './Entity';
import { Coin } from './Coin'; // Import the Coin class

export class Enemy extends Entity {
  constructor(x, y, width, height, speed, hp) {
    super(x, y, width, height);
    this.speed = speed;
    this.hp = hp; // Initialize enemy health points
    this.maxHp = hp;
    this.isAlive = true; // Flag to track if the enemy is alive
    this.droppedCoin = false;
  }

  // Enemy-specific movement logic (e.g., move towards player)
  followPlayer(player) {
    if (this.isAlive) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Move towards the player
      if (distance > 0) {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
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
    // this.dropCoin(); // Drop a coin when the enemy dies
  }

  // Drop a coin at the enemy's position
  dropCoin(index) {

      this.droppedCoin = true;
      const coinX = this.x + this.width / 2; // Center the coin's x position
      const coinY = this.y + this.height / 2; // Center the coin's y position
      return new Coin(index, coinX, coinY); // Create and return a new coin

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
