<template>
  <div id="game-container"></div>
</template>

<script>
import { GameState } from '@/assets/js/GameState'

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
      let gameState

      p.setup = () => {
        p.createCanvas(1000, 600)
        gameState = new GameState(p)
        p.keyPressed = gameState.keyPressed.bind(gameState)
        p.mousePressed = gameState.mousePressed.bind(gameState)
      }

      p.draw = () => {
        gameState.draw()
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
