import randomInteger from 'random-int';
import { Field } from './field';

export class Board {
  private readonly gridSize = 20;
  private readonly numberOfBombs = 30;
  private canvasSizePx = 500;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private fieldSizePx: number;

  private fields: Field[][] = [];

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.fieldSizePx = this.canvasSizePx / this.gridSize;
  }

  init() {
    this.initGridData();
    this.drawGrid();
  }

  placeBombs() {
    let numberOfPlacedBombs = 0;
    while (numberOfPlacedBombs < this.numberOfBombs) {
      const xRand = randomInteger(0, this.gridSize - 1);
      const yRand = randomInteger(0, this.gridSize - 1);

      if (!this.fields[xRand][yRand].hasBomb) {
        this.fields[xRand][yRand].hasBomb = true;
        numberOfPlacedBombs++;
      }
    }
  }

  private initGridData() {
    for (let x = 0; x < this.gridSize; x++) {
      this.fields[x] = [];
      for (let y = 0; y < this.gridSize; y++) {
        this.fields[x][y] = new Field();
      }
    }
  }

  private drawGrid() {
    if (!this.context) {
      return;
    }

    for (let x = 0; x < this.gridSize; x++) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvasSizePx);
    }

    for (let y = 0; y < this.gridSize; y++) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvasSizePx, y);
    }
  }
}
