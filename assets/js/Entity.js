// Entity.js - Base Class
export class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
  }

  // Generic move method for all entities
  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
  }

  // Collision detection method
  isCollidingWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  // Draw the entity (can be overridden)
  draw(p) {
    p.rect(this.x, this.y, this.width, this.height);
  }
}
