<template>
  <div id="game-container"></div>
</template>

<script>
import { Player } from '@/assets/js/Player'
import { Enemy } from '@/assets/js/Enemy'
import { Base } from '@/assets/js/Base'
import { Turret } from '@/assets/js/Turret'

export default {
  mounted() {
    if (process.client) {
      import('p5').then((p5) => {
        this.sketch = new p5.default(this.createSketch)
      })
    }
  },
  beforeDestroy() {
    if (this.sketch) {
      this.sketch.remove()
    }
  },
  methods: {
    createSketch(p) {
      let player
      let enemies = []
      let base
      let selectedTurret = null
      let isPlacingTurret = false
      let placedTurrets = []
      let isEditMode = false
      let turretHotbar = []
      let selectedTurretIndex = 0 // To track the selected turret from the hotbar

      p.setup = () => {
        p.createCanvas(1000, 600)
        player = new Player(50, 50, 30, 30, 5, 10)
        player.takeDamage(1)

        base = new Base(8, 6, 80, 100, 70) // 8x5 grid, each cell is 80px, starts at (100, 100)

        // Create some enemies
        for (let i = 0; i < 3; i++) {
          enemies.push(
            new Enemy(p.random(100, 500), p.random(100, 300), 30, 30, 2)
          )
        }

        // Initialize turret hotbar with turret configurations
        turretHotbar = [
          {
            turret: new Turret(0, 0, 40, 40, 10, 100, 1000, enemies),
            color: p.color(255, 0, 0),
          }, // Red turret
          {
            turret: new Turret(0, 0, 40, 40, 20, 100, 800, enemies),
            color: p.color(0, 0, 255),
          }, // Blue turret
          {
            turret: new Turret(0, 0, 40, 40, 30, 100, 600, enemies),
            color: p.color(0, 255, 0),
          }, // Green turret
        ]

        p.keyPressed = keyPressed
        p.mousePressed = mousePressed
      }

      function keyPressed() {
        if (p.key >= '1' && p.key <= '3') {
          selectedTurretIndex = parseInt(p.key) - 1 // Select turret based on key press
          selectedTurret = turretHotbar[selectedTurretIndex].turret // Get the turret instance
          selectedTurret.setPosition(p.mouseX, p.mouseY) // Set preview position to mouse
          isPlacingTurret = true // Start placing turret
          console.log(`Selected turret: Turret ${selectedTurretIndex + 1}`)
        } else if (p.key === ' ') {
          isEditMode = !isEditMode // Toggle edit mode
          isPlacingTurret = false // Exit placing mode when toggling
          console.log(`Edit mode is now ${isEditMode ? 'ON' : 'OFF'}`)
        }
      }

      function mousePressed() {
        if (p.mouseButton === p.LEFT) {
          // Only place turret on left click
          if (isPlacingTurret) {
            let col = Math.floor((p.mouseX - base.startX) / base.cellSize)
            let row = Math.floor((p.mouseY - base.startY) / base.cellSize)

            // Check if the click is inside the grid
            if (col >= 0 && col < base.cols && row >= 0 && row < base.rows) {
              let x = base.startX + col * base.cellSize
              let y = base.startY + row * base.cellSize

              // Set turret position and add it to the placed turrets array
              let newTurret = new Turret(
                x,
                y,
                40,
                40,
                selectedTurret.damage,
                selectedTurret.range,
                selectedTurret.fireRate,
                enemies
              )
              newTurret.color = turretHotbar[selectedTurretIndex].color // Set turret color
              placedTurrets.push(newTurret) // Add to placed turrets

              isPlacingTurret = false // Stop placing turret
              console.log(`Placed turret at (${x}, ${y})`)
            }
          }
        }
      }

      p.draw = () => {
        p.background(220)
        if (isEditMode) {
          base.drawGrid(p) // Draw the base grid
        }

        // Draw turret preview
        if (isPlacingTurret && selectedTurret) {
          selectedTurret.setPosition(p.mouseX - 20, p.mouseY - 20) // Center turret to mouse
          selectedTurret.color = turretHotbar[selectedTurretIndex].color // Set color for preview
          selectedTurret.draw(p)
        }

        placedTurrets.forEach((turret) => {
          turret.update(p)
          turret.draw(p)
        })

        // Update and draw the player
        player.update(p)
        player.draw(p)

        // Update and draw enemies
        for (let enemy of enemies) {
          enemy.followPlayer(player)
          enemy.draw(p)
        }

        // Draw hotbar
        p.fill(0)
        p.rect(10, 10, 130, 50) // Hotbar background
        for (let i = 0; i < turretHotbar.length; i++) {
          p.fill(turretHotbar[i].color)
          p.rect(10 + i * 40, 10, 40, 40) // Draw turret icons
        }
        p.fill(255)
        p.textSize(16)
        p.text('1', 25, 40)
        p.text('2', 65, 40)
        p.text('3', 105, 40)
      }
    },
  },
}
</script>

<style scoped>
#game-container {
  width: 100%;
  height: 100vh;
}
</style>
