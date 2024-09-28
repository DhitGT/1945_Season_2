// Enemy.js
import { Entity } from './Entity';

export class Enemy extends Entity {
  constructor(x, y, width, height, speed) {
    super(x, y, width, height);
    this.speed = speed;
  }

  // Enemy-specific movement logic (e.g., move towards player)
  followPlayer(player) {
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
