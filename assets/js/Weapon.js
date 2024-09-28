// Weapon.js
import { Bullet } from './Bullet';

export class Weapon {
  constructor(player, bulletSpeed, shootCooldown, width, height, magazineSize, reloadSpeed) {
    this.player = player; // Reference to the player holding the weapon
    this.bullets = [];
    this.bulletSpeed = bulletSpeed;
    this.shootCooldown = shootCooldown; // Time between shots
    this.lastShotTime = 0; // Track when the last shot was fired
    this.width = width; // Width of the weapon (rectangle)
    this.height = height; // Height of the weapon
    this.direction = { dx: 1, dy: 0 }; // Default direction (right)

    // Magazine properties
    this.magazineSize = magazineSize; // Total ammo in a magazine
    this.currentAmmo = magazineSize; // Current ammo in the magazine
    this.reloadSpeed = reloadSpeed; // Time it takes to reload
    this.reloadCooldown = 3000; // Reload cooldown in milliseconds (3 seconds)
    this.isReloading = false; // Flag for reloading
    this.reloadStartTime = 0; // Track when reloading starts

    // Recoil properties
    this.recoilMagnitude = 5; // Magnitude of the recoil shake
    this.recoilDuration = 200; // Duration of the recoil effect in milliseconds
    this.shakeOffset = { x: 0, y: 0 }; // Current shake offset
    this.shakeStartTime = 0; // Start time of the shake effect
    this.isShaking = false; // Flag for shaking state
  }

  // Method to fire a bullet from the weapon
  shoot(p, mouseX, mouseY) {
    const currentTime = p.millis();
    if (!this.isReloading && this.currentAmmo > 0 && currentTime - this.lastShotTime >= this.shootCooldown) {
      const bulletX = this.player.x + this.player.width / 2; // Center bullet's x
      const bulletY = this.player.y + this.player.height - 10; // Position the bullet at the bottom of the player

      const dx = mouseX - bulletX; // Direction x
      const dy = mouseY - bulletY; // Direction y
      const magnitude = Math.sqrt(dx * dx + dy * dy); // Calculate the magnitude
      const direction = { dx: dx / magnitude, dy: dy / magnitude }; // Normalize direction

      // Create new bullet with valid coordinates and direction
      const newBullet = new Bullet(
        bulletX,  // Starting x position
        bulletY,  // Starting y position
        direction.dx, // Direction x
        direction.dy, // Direction y
        this.bulletSpeed // Speed
      );

      this.bullets.push(newBullet);
      this.lastShotTime = currentTime;
      this.currentAmmo--;

      // Trigger recoil
      this.triggerRecoil();
    }
  }

  // Method to trigger the recoil effect
  triggerRecoil() {
    this.isShaking = true;
    this.shakeStartTime = Date.now();
  }

  // Method to start reloading
  reload(p) {
    if (!this.isReloading && this.currentAmmo < this.magazineSize) {
      this.isReloading = true;
      this.reloadStartTime = p.millis();
    }
  }

  // Update bullets, weapon state, and handle reloading
  update(p) {
    for (let bullet of this.bullets) {
      bullet.update();
    }
    // Remove bullets that are off the screen
    this.bullets = this.bullets.filter(bullet => bullet.isInBounds(p.width, p.height));

    // Handle reloading
    if (this.isReloading) {
      const currentTime = p.millis();
      if (currentTime - this.reloadStartTime >= this.reloadSpeed) {
        this.currentAmmo = this.magazineSize; // Refill the magazine
        this.isReloading = false; // Reset reloading flag
        this.reloadStartTime = 0; // Reset the start time
      }
    }

    // Handle shake effect
    if (this.isShaking) {
      const elapsed = Date.now() - this.shakeStartTime;
      if (elapsed < this.recoilDuration) {
        this.shakeOffset.x = (Math.random() * this.recoilMagnitude) - (this.recoilMagnitude / 2); // Random x offset
        this.shakeOffset.y = (Math.random() * this.recoilMagnitude) - (this.recoilMagnitude / 2); // Random y offset
      } else {
        this.isShaking = false; // Stop shaking
        this.shakeOffset = { x: 0, y: 0 }; // Reset shake offset
      }
    }
  }

  // Draw the weapon
  draw(p) {
    // Calculate the weapon's position
    const weaponX = this.player.x + this.player.width / 2 + this.shakeOffset.x; // Centered horizontally with shake offset
    const weaponY = this.player.y + this.player.height - 10 + this.shakeOffset.y; // Bottom of the player with shake offset

    // Save the current drawing state
    p.push();
    p.translate(weaponX, weaponY); // Move origin to weapon's position

    // Rotate based on direction
    const angle = Math.atan2(this.direction.dy, this.direction.dx);
    p.rotate(angle + Math.PI / 2); // Rotate the weapon to face the cursor (adjust the angle if needed)

    // Draw the weapon rectangle
    p.fill(255, 100, 100);
    p.rect(-this.width / 2, -this.height, this.width, this.height); // Centering the rectangle

    // Restore the previous drawing state
    p.pop();

    // Draw the bullets
    for (let bullet of this.bullets) {
      bullet.draw(p);
    }

    // Draw ammo count
    this.drawAmmo(p);
  }

  // Draw the current ammo count on the screen
  drawAmmo(p) {
    p.fill(255);
    p.textSize(16);
    p.text(`Ammo: ${this.currentAmmo} / ${this.magazineSize}`, this.player.x, this.player.y - 10); // Display above the player
  }

  // Update the direction of the weapon based on input
  setDirection(dx, dy) {
    this.direction = { dx, dy };
  }
}
