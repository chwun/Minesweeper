import randomInteger from 'random-int';
import { Field } from './field';

export class Board {
  private readonly gridSize = 20;
  private readonly numberOfBombs = 35;
  private canvasSizePx = 500;
  private canvasContentOffsetPx = 10;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private fieldSizePx: number;

  private fields: Field[][] = [];

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') ?? new CanvasRenderingContext2D();
    this.fieldSizePx = this.canvasSizePx / this.gridSize;
  }

  init() {
    this.canvas.addEventListener('click', (e: MouseEvent) => this.onCanvasClicked(e));
    this.canvas.addEventListener('contextmenu', (e: MouseEvent) => this.onContextMenu(e));

    this.initGridData();
    this.placeBombs();
    this.redrawGrid();
  }

  private placeBombs() {
    let numberOfPlacedBombs = 0;
    while (numberOfPlacedBombs < this.numberOfBombs) {
      const xRand = randomInteger(0, this.gridSize - 1);
      const yRand = randomInteger(0, this.gridSize - 1);

      if (!this.fields[xRand][yRand].hasBomb) {
        this.fields[xRand][yRand].hasBomb = true;
        this.fields[xRand][yRand].value = 0;
        numberOfPlacedBombs++;
        this.increaseAdjacentValues(xRand, yRand);
      }
    }
  }

  private increaseAdjacentValues(x: number, y: number) {
    const adjacentFields: [x: number, y: number][] = [];

    if (x >= 1) {
      adjacentFields.push([x - 1, y]);

      if (y >= 1) {
        adjacentFields.push([x - 1, y - 1]);
      }

      if (y < this.gridSize - 1) {
        adjacentFields.push([x - 1, y + 1]);
      }
    }

    if (x < this.gridSize - 1) {
      adjacentFields.push([x + 1, y]);

      if (y >= 1) {
        adjacentFields.push([x + 1, y - 1]);
      }

      if (y < this.gridSize - 1) {
        adjacentFields.push([x + 1, y + 1]);
      }
    }

    if (y >= 1) {
      adjacentFields.push([x, y - 1]);
    }

    if (y < this.gridSize - 1) {
      adjacentFields.push([x, y + 1]);
    }

    for (const [xAdj, yAdj] of adjacentFields) {
      if (!this.fields[xAdj][yAdj].hasBomb) {
        this.fields[xAdj][yAdj].value++;
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

  private redrawGrid() {
    if (!this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGridLines();
    this.drawGridContent();
  }

  private drawGridLines() {
    this.context.strokeStyle = 'black';
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

  private drawGridContent() {
    const offset = this.canvasContentOffsetPx;
    const fieldSize = this.fieldSizePx;
    const fieldCenterOffset = fieldSize / 2;

    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const field = this.fields[x][y];

        const fieldCenterX = x * fieldSize + offset + fieldCenterOffset;
        const fieldCenterY = y * fieldSize + offset + fieldCenterOffset;
        const fieldTopLeftX = x * fieldSize + offset + 1;
        const fieldTopLeftY = y * fieldSize + offset + 1;

        if (!field.isRevealed) {
          this.context.fillStyle = 'gray';
          this.context.fillRect(fieldTopLeftX, fieldTopLeftY, fieldSize - 2, fieldSize - 2);

          if (field.isFlagged) {
            this.context.beginPath();
            this.context.fillStyle = 'black';
            this.context.arc(fieldCenterX, fieldCenterY, fieldSize * 0.3, 0, 2 * Math.PI);
            this.context.stroke();
          }
        } else {
          if (field.hasBomb) {
            this.context.beginPath();
            this.context.fillStyle = 'red';
            this.context.arc(fieldCenterX, fieldCenterY, fieldSize * 0.4, 0, 2 * Math.PI);
            this.context.fill();
          } else {
            if (field.value > 0) {
              let textColor = 'black';
              switch (field.value) {
                case 1:
                  textColor = 'green';
                  break;

                case 2:
                  textColor = 'blue';
                  break;

                case 3:
                  textColor = 'orange';
                  break;

                default:
                  textColor = 'red';
                  break;
              }

              this.context.font = 'bold 18px Arial';
              this.context.fillStyle = textColor;
              this.context.textAlign = 'center';
              this.context.fillText(
                String(field.value),
                fieldCenterX,
                fieldCenterY + fieldSize * 0.25
              );
            }
          }
        }
      }
    }
  }

  private revealField(xGrid: number, yGrid: number) {
    if (this.fields[xGrid][yGrid].isFlagged) {
      return;
    }

    this.fields[xGrid][yGrid].isRevealed = true;

    if (this.fields[xGrid][yGrid].hasBomb) {
      // explode -> lose game
    } else {
      // reveal adjacent fields
    }

    this.redrawGrid();
  }

  private flagField(xGrid: number, yGrid: number) {
    if (this.fields[xGrid][yGrid].isRevealed) {
      return;
    }

    this.fields[xGrid][yGrid].isFlagged = true;
    this.redrawGrid();
  }

  private onCanvasClicked(e: MouseEvent): void {
    this.handleMouseClick(e);
  }

  private onContextMenu(e: MouseEvent): void {
    this.handleMouseClick(e);
  }

  private handleMouseClick(e: MouseEvent) {
    if (!e) {
      return;
    }

    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - this.canvasContentOffsetPx;
    const y = e.clientY - rect.top - this.canvasContentOffsetPx;

    if (x < 0 || y < 0) {
      return;
    }

    const xGrid = Math.floor(x / this.fieldSizePx);
    const yGrid = Math.floor(y / this.fieldSizePx);

    if (xGrid > this.gridSize || yGrid > this.gridSize) {
      return;
    }

    if (e.button == 0) {
      console.log('left mouse button clicked');
    } else if (e.button == 2) {
      console.log('right mouse button clicked');
    }
  }

  private handleFieldLeftClick(xGrid: number, yGrid: number) {
    this.revealField(xGrid, yGrid);
  }

  private handleFieldRightClick(xGrid: number, yGrid: number) {
    this.flagField(xGrid, yGrid);
  }
}
