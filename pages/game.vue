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
      let turret

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        player = new Player(50, 50, 30, 30, 5, 10)
        player.takeDamage(1)

        base = new Base(100, 100, 100, 100) // Example base position and size
        turret = new Turret(100, 100, 40, 40, 10, 100, 1000, enemies) // Example turret properties

        // Create some enemies
        for (let i = 0; i < 3; i++) {
          enemies.push(
            new Enemy(p.random(100, 500), p.random(100, 300), 30, 30, 2)
          )
        }
        base.placeTurret(turret)

        windowResized()
      }

      function windowResized() {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
      }

      p.draw = () => {
        windowResized()
        p.background(220)

        // Update and draw the player
        player.update(p)
        player.draw(p)

        // Draw the base and turrets
        base.draw(p)
        base.update(p) // Update the turrets

        // Update and draw enemies
        for (let enemy of enemies) {
          enemy.followPlayer(player)
          enemy.draw(p)

          // Check if the player is colliding with any enemies
          // if (player.isCollidingWith(enemy)) {
          //   p.fill(255, 0, 0);
          //   p.textSize(32);
          //   p.text('Game Over!', p.width / 2 - 80, p.height / 2);
          //   p.noLoop();
          // }
        }
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
