// Coin.js
export class Coin {
  constructor(index, x, y) {
    this.x = x; // X position of the coin
    this.y = y; // Y position of the coin
    this.size = 10; // Size of the coin (diameter)
    this.collected = false; // Flag to check if the coin is collected
    this.index = index
  }


  // Method to check if the player collects the coin
  collect(player) {
    if (!this.collected) {
      // Check collision with player
      if (this.x < player.x + player.width &&
        this.x + this.size > player.x &&
        this.y < player.y + player.height &&
        this.y + this.size > player.y) {
        this.collected = true; // Mark coin as collected
        player.addCoins(1); // Add coins to the player
        console.log('Coin collected!');
      }
    }
  }


  // Method to draw the coin
  draw(p) {
    if (!this.collected) { // Only draw if not collected
      p.fill(255, 215, 0); // Gold color for the coin
      p.ellipse(this.x, this.y, this.size); // Draw the coin
    }
  }
}
