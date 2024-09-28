// Base.js
export class Base {
  constructor(x, y, width, height) {
    this.x = x; // X position of the base
    this.y = y; // Y position of the base
    this.width = width; // Width of the base
    this.height = height; // Height of the base
    this.turrets = []; // Array to hold the placed turrets
  }

  // Method to place a turret at a specific position
  placeTurret(turret) {
    if (this.canPlaceTurret(turret)) {
      this.turrets.push(turret);
      console.log(`Turret placed at (${turret.x}, ${turret.y})`);
    } else {
      console.log('Cannot place turret here.');
    }
  }

  // Method to check if a turret can be placed
  canPlaceTurret(turret) {
    // Check if the turret fits within the base boundaries
    return (
      turret.x >= this.x &&
      turret.y >= this.y &&
      turret.x + turret.width <= this.x + this.width &&
      turret.y + turret.height <= this.y + this.height
    );
  }

  // Method to draw the base and the turrets
  draw(p) {
    // Save the current drawing style for the base
    p.push();

    // Draw the base (you can customize the appearance)
    p.fill(150, 75, 255); // Example color for the base
    p.rect(this.x, this.y, this.width, this.height);

    // Restore the previous drawing style for the base
    p.pop();

    // Draw each turret
    this.turrets.forEach(turret => turret.draw(p));
  }

  // Method to update the turrets
  update(p) {
    this.turrets.forEach(turret => turret.update(p));
  }
}
