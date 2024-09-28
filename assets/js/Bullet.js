// Bullet.js
import { Entity } from './Entity';

export class Bullet extends Entity {
  constructor(x, y, dx, dy, speed, damage, index) {
    super(x, y, 5, 5); // Bullet is small
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;
    this.damage = damage;
    this.index = index;
  }

  // Move the bullet in the direction it was shot
  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    // console.log("ball : " + this.x)
  }

  collidesWith(enemy) {
    return (
      this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y
    );
  }

  // Check if the bullet is within the bounds of the screen
  isInBounds(width, height) {
    return this.x >= 0 && this.x <= width && this.y >= 0 && this.y <= height;
  }

  // Draw the bullet
  draw(p) {
    p.push();
    p.fill(255, 0, 0);
    p.rect(this.x, this.y, this.width, this.height);
    p.pop();
  }
}
