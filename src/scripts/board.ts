import randomInteger from 'random-int';
import { Field } from './field';

export class Board {
  private readonly gridSize = 20;
  private readonly numberOfBombs = 30;
  private canvasSizePx = 500;
  private canvasContentOffsetPx = 10;

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

    this.context.strokeStyle = '#163d8a';
    this.context.lineWidth = 2;

    const offset = this.canvasContentOffsetPx;

    for (let x = 0; x <= this.gridSize; x++) {
      this.context.beginPath();
      this.context.moveTo(x * this.fieldSizePx + offset, 0 + offset);
      this.context.lineTo(x * this.fieldSizePx + offset, this.canvasSizePx + offset);
      this.context.stroke();
    }

    for (let y = 0; y <= this.gridSize; y++) {
      this.context.beginPath();
      this.context.moveTo(0 + offset, y * this.fieldSizePx + offset);
      this.context.lineTo(this.canvasSizePx + offset, y * this.fieldSizePx + offset);
      this.context.stroke();
    }
  }
}
