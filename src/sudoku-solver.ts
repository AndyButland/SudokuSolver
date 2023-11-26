import { Grid, Coordinate } from "./types";

class SudoukuSolver extends HTMLElement {

  constructor() {
    super();
    this.populateGrid(this.getAttribute("initial-state"));
  }

  readonly GridSize = 9;
  readonly BoxSize = 3;

  private _gridPopulated = false;
  private _solutionAttempted = false;
  private _solutionFound = false;
  private _grid: number[][];

  private populateGrid(initialState: string) {
    this.initializeGrid();
    this.populateGridFromState(initialState);
    this._gridPopulated = true;
    this.renderComponent();
  }

  private initializeGrid() {
    this._grid = new Array<Array<number>>();
    for (let row = 0; row < this.GridSize; row++) {
      let rowArray:number[]  = new Array<number>();
      for (let x = 0; x < this.GridSize; x++){
        rowArray.push(0);
      }
      this._grid.push(rowArray);
    }
  }

  private populateGridFromState(initialState: string) {
    let col = 0, row = 0;
    for (let i = 0; i < initialState.length; i++) {
      if (initialState[i] !== ' ') {
        this._grid[col][row] =  parseInt(initialState[i]);
      }

      col++;
      if (col === this.GridSize) {
        col = 0;
        row++;
      }

      if (row === this.GridSize) {
        break;
      }
    }
  }

  private getGridHtml() {
    let html = '<table> <colgroup><col><col><col><colgroup><col><col><col><colgroup><col><col><col>';
    for (let row = 0; row < this.GridSize; row++) {
      if (row % 3 === 0) {
        html += '<tbody>';
      }
      html += '<tr>';
      for (let col = 0; col < this.GridSize; col++) {
        html += `<td>${(this._grid[col][row] > 0 ? this._grid[col][row] : "")}`;
      }
    }
    html += '</table>'
    return html;
  }

  private solve() {
    this._solutionAttempted = true;
    this._solutionFound = this.solveGrid(this._grid);
    this.renderComponent();
  }

  private solveGrid(grid: Grid) {

    const coordinate = this.getNextCoordinate(grid);
    if (coordinate === null) {
      return true;
    }

    for (let number = 1; number <= this.GridSize; number++) {
      if (this.isNumberValidAtCoordinate(grid, coordinate, number)) {
        grid[coordinate.col][coordinate.row] = number;
        if (this.solveGrid(grid)) {
          return true;
        }

        grid[coordinate.col][coordinate.row] = 0;
      }
    }

    return false;
  }

  private getNextCoordinate(grid: Grid) {
    for (let row = 0; row < this.GridSize; row++) {
      for (let col = 0; col < this.GridSize; col++){
        if (grid[col][row] === 0) {
          return { row, col };
        }
      }
    }

    return null;
  }

  private isNumberValidAtCoordinate(grid: Grid, coordinate: Coordinate, number: number) {
    return (
      !this.isNumberUsedInRow(grid, coordinate.row, number) &&
      !this.isNumberUsedInCol(grid, coordinate.col, number) &&
      !this.isNumberUsedInBox(
        grid, {
          row: coordinate.row - (coordinate.row % 3),
          col: coordinate.col - (coordinate.col % 3)
        }, number));
  }

  private isNumberUsedInRow(grid: Grid, row: number, number: number) {
    for (let col = 0; col < this.GridSize; col++) {
        if (grid[col][row] === number) {
          return true;
        }
    }

    return false;
  }

  private isNumberUsedInCol(grid: Grid, col: number, number: number) {
    for (let row = 0; row < this.GridSize; row++) {
        if (grid[col][row] === number) {
          return true;
        }
    }

    return false;
  }

  private isNumberUsedInBox(grid: Grid, boxStartCoordinate: Coordinate, number: number) {
    for (let row = 0; row < this.BoxSize; row++) {
        for (let col = 0; col < this.BoxSize; col++) {
            if (grid[col + boxStartCoordinate.col][row + boxStartCoordinate.row] === number) {
              return true;
            }
        }
    }

    return false;
  }

  renderComponent() {
    this.innerHTML = `<h1>Sudoku Solver</h1>`;

    if (this._gridPopulated) {
      this.innerHTML += this.getGridHtml();
    }

    if (this._solutionAttempted) {
      this.innerHTML += `<div class="solution">${(this._solutionFound ? "Solution found." : "No solution exists.")}</div>`
    } else {
      this.innerHTML += `<div class="button"><button id="solve">Solve Puzzle</button></div>`;
      document.getElementById("solve")?.addEventListener("click", () => this.solve(), false);
    }
  }

  connectedCallback() {
    this.renderComponent();
  }

}

customElements.define('sudouku-solver', SudoukuSolver);