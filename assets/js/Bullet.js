// Bullet.js
import { Entity } from './Entity';

export class Bullet extends Entity {
  constructor(x, y, dx, dy, speed) {
    super(x, y, 5, 5); // Bullet is small
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;
  }

  // Move the bullet in the direction it was shot
  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    console.log("ball : " + this.x)
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
