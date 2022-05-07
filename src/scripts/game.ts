import { Board } from './board';

export class Game {
  private board: Board | undefined;

  init() {
    this.board = new Board();
    this.board.init();
  }
}
