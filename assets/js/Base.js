export class Base {
  constructor(cols, rows, cellSize, startX, startY) {
    this.cols = cols; // Number of columns
    this.rows = rows; // Number of rows
    this.cellSize = cellSize; // Size of each grid cell
    this.startX = startX; // X-coordinate where grid starts
    this.startY = startY; // Y-coordinate where grid starts
    this.grid = this.createGrid();
  }

  // Create a grid array with all cells initialized as null (no turret)
  createGrid() {
    let grid = [];
    for (let col = 0; col < this.cols; col++) {
      let rowArray = [];
      for (let row = 0; row < this.rows; row++) {
        rowArray.push(null); // No turret in any cell initially
      }
      grid.push(rowArray);
    }
    return grid;
  }

  // Draw the grid on the screen
  drawGrid(p) {
    p.stroke(255); // White grid lines
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        let x = this.startX + col * this.cellSize;
        let y = this.startY + row * this.cellSize;
        p.noFill();
        p.rect(x, y, this.cellSize, this.cellSize); // Draw each cell

        // Highlight the cell if it's hovered by the mouse
        if (this.isHovered(p, col, row)) {
          p.fill(200, 200, 0, 100); // Highlight color (yellow)
          p.rect(x, y, this.cellSize, this.cellSize);
        }
      }
    }
  }

  // Check if the mouse is hovering over a particular cell
  isHovered(p, col, row) {
    let x = this.startX + col * this.cellSize;
    let y = this.startY + row * this.cellSize;
    return p.mouseX > x && p.mouseX < x + this.cellSize && p.mouseY > y && p.mouseY < y + this.cellSize;
  }

  // Place a turret in a grid cell
  placeTurret(p, col, row, turret) {
    if (this.grid[col][row] === null) { // Ensure the cell is empty
      this.grid[col][row] = turret;
      turret.setPosition(this.startX + col * this.cellSize, this.startY + row * this.cellSize);
    }
  }
}
