// assets/js/GameState.js
import { Player } from './Player'
import { Enemy } from './Enemy'
import { Base } from './Base'
import { Turret } from './Turret'

export class GameState {
  constructor(p) {
    this.p = p
    this.player = new Player(50, 50, 30, 30, 5, 10)
    this.base = new Base(8, 6, 80, 100, 70)
    this.enemies = []
    this.placedTurrets = []
    this.turretHotbar = []
    this.selectedTurret = null
    this.selectedTurretIndex = 0
    this.isPlacingTurret = false
    this.isEditMode = false
    this.coins = []

    this.initGame()
  }

  initGame() {
    this.player.takeDamage(1)

    // Initialize enemies
    for (let i = 0; i < 3; i++) {
      this.enemies.push(new Enemy(this.enemies, i, this.p.random(100, 500), this.p.random(100, 300), 30, 30, 2, 300))
    }

    // Initialize turret hotbar with turret configurations
    this.turretHotbar = [
      {
        turret: new Turret(0, 0, 40, 40, 10, 100, 1000, this.enemies),
        color: this.p.color(255, 0, 0),
        price: 20
      },
      {
        turret: new Turret(0, 0, 40, 40, 15, 100, 800, this.enemies),
        color: this.p.color(0, 0, 255),
        price: 70
      },
      {
        turret: new Turret(0, 0, 40, 40, 20, 100, 100, this.enemies),
        color: this.p.color(0, 255, 0),
        price: 200
      },
    ]
  }

  keyPressed() {
    if (this.p.key >= '1' && this.p.key <= '3') {
      this.selectedTurretIndex = parseInt(this.p.key) - 1
      this.selectedTurret = this.turretHotbar[this.selectedTurretIndex].turret
      this.selectedTurret.setPosition(this.p.mouseX, this.p.mouseY)
      this.isPlacingTurret = true
      console.log(`Selected turret: Turret ${this.selectedTurretIndex + 1}`)
    } else if (this.p.key === ' ') {
      this.isEditMode = !this.isEditMode
      this.isPlacingTurret = false
      console.log(`Edit mode is now ${this.isEditMode ? 'ON' : 'OFF'}`)
    }
  }

  mousePressed() {
    if (this.p.mouseButton === this.p.LEFT && this.isPlacingTurret) {
      const selectedTurretPrice = this.turretHotbar[this.selectedTurretIndex].price;

      // Check if player has enough coins
      if (this.player.coins >= selectedTurretPrice) {
        const col = Math.floor((this.p.mouseX - this.base.startX) / this.base.cellSize);
        const row = Math.floor((this.p.mouseY - this.base.startY) / this.base.cellSize);

        if (col >= 0 && col < this.base.cols && row >= 0 && row < this.base.rows) {
          const x = this.base.startX + col * this.base.cellSize;
          const y = this.base.startY + row * this.base.cellSize;

          // Create and place the new turret
          const newTurret = new Turret(
            x, y, 40, 40,
            this.selectedTurret.damage,
            this.selectedTurret.range,
            this.selectedTurret.fireRate,
            this.enemies
          );
          newTurret.coins = this.coins;
          newTurret.color = this.turretHotbar[this.selectedTurretIndex].color;
          this.placedTurrets.push(newTurret);

          // Deduct coins for the turret purchase
          this.player.coins -= selectedTurretPrice;

          this.isPlacingTurret = false;
          console.log(`Placed turret at (${x}, ${y}), Remaining coins: ${this.player.coins}`);
        }
      } else {
        console.log(`Not enough coins to place turret. You need ${selectedTurretPrice} coins.`);
      }
    }
  }


  draw() {
    this.p.background(220)

    if (this.isEditMode) {
      this.base.drawGrid(this.p)
    }

    this.drawCoins()
    this.handlePlayerActions()
    this.updateTurrets()
    this.updateEnemies()
    this.updateCoins()

    this.drawHotbar()
  }

  drawCoins() {
    this.p.fill(255);
    this.p.textSize(20);
    this.p.textAlign(this.p.RIGHT);
    this.p.text(`Coins: ${this.player.coins}`, this.p.width - 10, 30);  // Show player coins
  }


  updateTurrets() {
    if (this.isPlacingTurret && this.selectedTurret) {
      this.selectedTurret.setPosition(this.p.mouseX - 20, this.p.mouseY - 20)
      this.selectedTurret.color = this.turretHotbar[this.selectedTurretIndex].color
      this.selectedTurret.draw(this.p)
    }

    this.placedTurrets.forEach((turret) => {
      turret.update(this.p)
      turret.draw(this.p)
    })
  }

  updateEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];

      // Find the nearest target (player or turret)
      let nearestTarget = this.findNearestTarget(enemy);

      // If there's a valid target, follow and potentially attack it
      if (nearestTarget) {
        enemy.followTarget(nearestTarget);
      }

      // Handle bullet collision
      for (let j = 0; j < this.player.weapon.bullets.length; j++) {
        const bullet = this.player.weapon.bullets[j];

        if (enemy.collidesWith(bullet)) {
          enemy.takeDamage(bullet.damage);
          this.player.weapon.bullets.splice(j, 1);

          if (!enemy.isAlive && !enemy.droppedCoin) {
            this.enemies.splice(i, 1);
            this.coins.push(enemy.dropCoin(this.coins.length));
          }
          break;
        }
      }

      enemy.draw(this.p);
    }
  }

  // Method to find the nearest target (player or turret)
  findNearestTarget(enemy) {
    let nearestTarget = null;
    let closestDistance = Infinity;

    // Check the player
    const playerDistance = this.p.dist(enemy.position.x, enemy.position.y, this.player.position.x, this.player.position.y);
    if (playerDistance < closestDistance) {
      closestDistance = playerDistance;
      nearestTarget = this.player;
    }

    // Check placed turrets
    for (let turret of this.placedTurrets) {
      const turretDistance = this.p.dist(enemy.position.x, enemy.position.y, turret.position.x, turret.position.y);
      if (turretDistance < closestDistance) {
        closestDistance = turretDistance;
        nearestTarget = turret;
      }
    }

    return nearestTarget;
  }


  updateCoins() {
    for (let coin of this.coins) {
      if (!coin.collected) {
        coin.collect(this.player)
      }
      coin.draw(this.p)

      if (coin.collected) {
        this.coins.splice(coin.index, 1)
      }
    }
  }

  handlePlayerActions() {
    this.player.update(this.p)
    this.player.draw(this.p)
  }

  drawHotbar() {
    // Draw hotbar background
    this.p.fill(50, 50, 50);  // Darker background color
    this.p.rect(10, 10, 130, 50, 10);  // Rounded corners

    // Draw each turret in the hotbar
    for (let i = 0; i < this.turretHotbar.length; i++) {
      const turret = this.turretHotbar[i];

      // Change color on hover
      if (
        this.p.mouseX > 10 + i * 40 &&
        this.p.mouseX < 10 + i * 40 + 40 &&
        this.p.mouseY > 10 &&
        this.p.mouseY < 50
      ) {
        this.p.fill(100, 100, 100);  // Darker color on hover
      } else {
        this.p.fill(turret.color);
      }

      this.p.rect(10 + i * 40, 10, 40, 40, 5);  // Rounded corners

      // Draw price text centered below the turret
      this.p.fill(255);  // White color for price text
      this.p.textSize(12);
      this.p.textAlign(this.p.CENTER, this.p.TOP);
      this.p.text(turret.price, 30 + i * 40, 50);  // Centered price below turret
    }

    // Draw hotbar title
    this.p.fill(255);
    this.p.textSize(16);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.text('Turret Hotbar', 10, 70);  // Title for hotbar
  }
  findNearestTarget(enemy) {
    let nearestTarget = null;
    let closestDistance = Infinity;

    // Check the player
    const playerDistance = this.p.dist(enemy.x, enemy.y, this.player.x, this.player.y);
    if (playerDistance < closestDistance) {
      closestDistance = playerDistance;
      nearestTarget = this.player;
    }

    // Check placed turrets
    for (let turret of this.placedTurrets) {
      const turretDistance = this.p.dist(enemy.x, enemy.y, turret.x, turret.y);
      if (turretDistance < closestDistance) {
        closestDistance = turretDistance;
        nearestTarget = turret;
      }
    }

    return nearestTarget;
  }



}
