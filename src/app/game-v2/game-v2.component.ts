import { AfterViewInit, Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game-v2',
  templateUrl: './game-v2.component.html',
  styleUrls: ['./game-v2.component.css'],
})
export class GameV2Component implements OnInit, AfterViewInit{

  @ViewChild('boardRef') boardRef!: ElementRef<HTMLElement>;

  private _rows: number = 3;
  private _cols: number = 4;
  private _winningCells: number = 3;
  private _stepReset: number = 3;

  @Input()
  get rows(): number {
    return this._rows;
  }
  set rows(value: number) {
    if (value < 3) return;
    this._rows = value;
    this.resetGame();
    this.updateGridCSS();
  }

  @Input()
  get cols(): number {
    return this._cols;
  }
  set cols(value: number) {
    if (value < 3) return;
    this._cols = value;
    this.resetGame();
    this.updateGridCSS();
  }

  @Input()
  get winningCells(): number {
    return this._winningCells;
  }
  set winningCells(value: number) {
    if (value < 1 || value > Math.max(this._cols, this.rows)) return;
    this._winningCells = value;
    this.resetGame();
  }

  @Input()
  get stepReset(): number {
    return this._stepReset;
  }
  set stepReset(value: number) {
    if (value < 3 || this.step > this._cols * this._rows) return;
    this._stepReset = value;
  }

  step: number = 0;
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  board: number[] = Array(this.cols * this.rows).fill(0);

  constructor() {}

  ngOnInit(): void {
    this.resetGame();
  }

  ngAfterViewInit(): void {
    this.updateGridCSS();
  }

  private updateGridCSS() {
    const boardEl = this.boardRef?.nativeElement;
    if (!boardEl) return;
    boardEl.style.setProperty('--cols', this.cols.toString()); 
    boardEl.style.setProperty('--rows', this.rows.toString()); 
  }

  private updateBoardState(selectedValue: number) {
    for(let i = 0; i < this.board.length; i++) {
      const cell = this.board[i];
      if (cell * selectedValue <= 0) continue;
      this.board[i] += cell > 0 ? -1 : 1;
    }
  }

  isWarnPlayer(cell: number): boolean {
    if (!cell) return false;
    const player = cell > 0 ? 'X' : 'O';
    return Math.abs(cell) == 1 && this.currentPlayer === player
  }

  handleNextStep(e: MouseEvent): void {
    if (this.winner || this.step == this.cols * this.rows) return;
    
    const target = e.target as HTMLElement;
    if (!target || !target.closest('.cell')) return;

    const idx = +target.getAttribute('data-idx')!;
    if (this.board[idx]) return;

    const value = this.currentPlayer === 'X' ? this.stepReset : -this.stepReset;
    this.updateBoardState(value);
    this.board[idx] = value;

    if (this.checkWin(idx)) {
      this.winner = this.currentPlayer;
    }
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  checkWin(i: number) {
    const player = this.board[i];
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    const row = Math.floor(i / this.cols);
    const col = i % this.cols;

    const isBounds = (x: number, y: number) => {
      return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    };

    const getIndex = (x: number, y: number) => x * this.cols + y;

    for (const [x, y] of directions) {
      let count = 1;

      for (let step = 1; step < this.winningCells; step++) {
        const r = row + x * step;
        const c = col + y * step;

        if (!isBounds(r, c) || this.board[getIndex(r, c)] * player <= 0)
          break;
        count++;
      }

      for (let step = 1; step < this.winningCells; step++) {
        const r = row - x * step;
        const c = col - y * step;

        if (
          !isBounds(r, c) ||
          this.board[getIndex(r, c)] * player <= 0 ||
          count >= this.winningCells
        )
          break;
        count++;
      }

      if(count >= this.winningCells) return player;
    }

    return 0;
  }

  resetGame() {
    this.board = Array(this.board.length).fill(0);
    this.winner = null;
  }

  trackByValue(idx: number, value: number) {
    return idx;
  }

  logBoard() {
    console.log(this.board);
  }
}
