// Player.js
import { Entity } from './Entity';
import { Weapon } from './Weapon';

export class Player extends Entity {
  constructor(x, y, width, height, speed, maxHealth) {
    super(x, y, width, height);
    this.speed = speed;
    this.maxHealth = maxHealth; // Maximum health
    this.currentHealth = maxHealth; // Current health
    // Create a weapon with physical dimensions and position offset
    this.weapon = new Weapon(this, 7, 100, 8, 20, 30, 1000); // width, height, offsetX, offsetY
    this.coins = 0; // Initialize coins


  }

  addCoins(amount) {
    this.coins += amount;
    console.log(`Coins added: ${amount}. Total coins: ${this.coins}`);
  }

  // Method to spend coins for purchasing turrets
  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      console.log(`Coins spent: ${amount}. Remaining coins: ${this.coins}`);
      return true; // Purchase successful
    } else {
      console.log('Not enough coins to purchase turret.');
      return false; // Purchase failed
    }
  }

  // Method to apply damage
  takeDamage(amount) {
    this.currentHealth = Math.max(this.currentHealth - amount, 0); // Ensure health doesn't go below 0
  }

  // Method to heal the player (optional)
  heal(amount) {
    this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth); // Ensure health doesn't exceed max
  }

  // Draw the health bar
  drawHealthBar(p) {
    const barWidth = this.width; // Same width as the player
    const barHeight = 10; // Height of the health bar
    const healthRatio = this.currentHealth / this.maxHealth; // Calculate health ratio

    // Draw the background of the health bar
    p.fill(200, 0, 0); // Red for background
    p.rect(this.x, this.y - 15, barWidth, barHeight); // Position above the player

    // Draw the current health
    p.fill(0, 200, 0); // Green for current health
    p.rect(this.x, this.y - 15, barWidth * healthRatio, barHeight); // Fill according to health
  }

  // Handle player movement with WASD keys
  handleMovement(p) {
    if (p.keyIsDown(87)) { // W key
      this.move(0, -1);
    }
    if (p.keyIsDown(83)) { // S key
      this.move(0, 1);
    }
    if (p.keyIsDown(65)) { // A key
      this.move(-1, 0);
    }
    if (p.keyIsDown(68)) { // D key
      this.move(1, 0);
    }
  }

  handleReload(p) {
    // console.log("reloaddd")
    if (p.keyIsDown(82)) { // Use 'r' directly
      console.log("reloaddd2")
      if (this.weapon) {
        this.weapon.reload(p); // Call the weapon's reload method
      }
    }
  }

  // Handle shooting with arrow keys, pass direction to weapon
  // Handle shooting with the left mouse button
  handleShooting(p) {
    // Get the mouse position
    const mouseX = p.mouseX;
    const mouseY = p.mouseY;

    // Calculate direction to the mouse cursor
    const dx = mouseX - (this.x + this.width / 2);
    const dy = mouseY - (this.y + this.height);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction
    if (distance > 0) {
      this.weapon.setDirection(dx / distance, dy / distance); // Normalize direction
    }

    // Shoot when the left mouse button is pressed
    if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
      this.weapon.shoot(p, mouseX, mouseY);
    }
  }


  // Update the player and the weapon
  update(p) {
    this.handleMovement(p);
    this.handleReload(p);
    this.handleShooting(p);
    this.weapon.update(p); // Update the bullets managed by the weapon
  }

  // Draw the player and the weapon's bullets
  draw(p) {
    // Draw the player
    p.fill(100, 150, 200);
    p.rect(this.x, this.y, this.width, this.height);

    // Draw the weapon
    this.weapon.draw(p);

    // Draw the health bar
    this.drawHealthBar(p); // Draw health bar above the player
  }
}
