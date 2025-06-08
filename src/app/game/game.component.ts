import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  board: string[][];
  step: number;
  winner: string | null;
  status: string;
  rows: number;
  cols: number;

  constructor() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

    this.step = 0;
    this.winner = null;
    this.status = "";
    this.rows = this.board.length;
    this.cols = this.board[0].length;
  }

  handleNextStep(e: MouseEvent) {
    if(this.winner || this.step === this.cols * this.rows) return;
    
    const target = e.target as HTMLElement;
    if (!target.classList.contains('cell')) return;

    const row = +target.getAttribute('data-row')!;
    const col = +target.getAttribute('data-col')!;
    
    if(this.board[row][col]) return;
    const player = ++this.step % 2 == 0 ? 'X' : 'O';
    this.board[row][col] = player;

    const win = this.checkWin(player, row, col);
    if(win) {
      this.winner = player;
      this.status = `${player} is a winner`;
    }
    console.log({
      col,
      row,
      win
    });
    console.log(this.step);

    console.log(this.board.length);

    if (this.step === this.cols * this.rows) {
      this.status = `It's a draw!`;
    }
  }

  
  private allEqual(player: string, row: number, col: number, dx: number, dy:number, length: number) : boolean {
    for(let i = 0; i < length; i++) {
      if(this.board[row + i * dx][col + i * dy] !== player) return false;
    }
    return true;
  }


  checkWin(player: string, i: number, j: number, length: number = 3) : boolean {
      if (j < this.cols && this.allEqual(player, i, 0, 0, 1, length)){
        console.log('1');
        this.printBoard();
        return true;
      }

      if (i < this.rows && this.allEqual(player, 0, j, 1, 0, length)) {
        console.log('1');
        this.printBoard();
        return true;
      }

      const isMainDiagonal = i === j;
      const isAntiDiagonal = i + j === this.rows - 1 ;

      if (isMainDiagonal && this.allEqual(player, 0, 0, 1, 1, length)) {
        console.log('3');
        this.printBoard();
        return true;
      }

      if (isAntiDiagonal && this.allEqual(player, 0, this.cols - 1, 1, -1, length)) {
        console.log('4');
        this.printBoard();
        return true;
      }
      return false;
  }

  resetGame() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.step = 0;
    this.winner = null;
    this.status = '';
  }

  printBoard(): void {
    console.log(this.board);
  }

  trackByCell(index: number, cell: string) {
    return index;
  }
}
