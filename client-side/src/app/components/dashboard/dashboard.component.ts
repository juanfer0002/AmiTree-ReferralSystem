import { Component, OnInit } from '@angular/core';


type Player = 'player_1' | 'player_2';

const BOARD_ROW_SIZE = 6;
const BOARD_COL_SIZE = 7;

const TOKEN_LENGTH_WIN = 4;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    board: Cell[][] = [];

    activePlayer: Player = 'player_1';

    gameover = false;

    constructor() {
        this.initBoard();
    }

    ngOnInit() {
    }

    initBoard() {
        for (let i = 0; i < BOARD_ROW_SIZE; i++) {
            const row = [];

            for (let j = 0; j < BOARD_COL_SIZE; j++) {
                row.push(new Cell(i, j));
            }

            this.board.push(row);
        }
    }

    selectColumn(column: number) {
        let foundEmptySpot: Cell = null;

        for (let i = BOARD_ROW_SIZE - 1; i >= 0 && !foundEmptySpot; i--) {
            let spot = this.board[i][column];
            foundEmptySpot = !spot.hasToken() ? spot : null;
        }

        foundEmptySpot && foundEmptySpot.changePlayer(this.activePlayer);

        this.checkIfPlayerWon();
        this.togglePlayer();
    }

    checkIfPlayerWon() {
        this.gameover = this.checkIfPlayerWonByRow();
        this.gameover = this.gameover || this.checkIfPlayerWonByColumn();
        this.gameover = this.gameover || this.checkIfPlayerWonByDiagonalLRDown();
        this.gameover = this.gameover || this.checkIfPlayerWonByDiagonalRLDown();
    }

    checkIfPlayerWonByRow() {
        let won = false;

        let count = 0;
        for (let i = 0; i < BOARD_ROW_SIZE && !won; i++) {
            count = 0;

            for (let j = 0; j < BOARD_COL_SIZE && !won; j++) {
                const cell = this.board[i][j];
                count = cell.owner == this.activePlayer ? count + 1 : 0;
                won = count == TOKEN_LENGTH_WIN;
            }
        }

        return won;
    }

    checkIfPlayerWonByColumn() {
        let won = false;

        let count = 0;
        for (let j = 0; j < BOARD_COL_SIZE && !won; j++) {
            count = 0;

            for (let i = 0; i < BOARD_ROW_SIZE && !won; i++) {
                const cell = this.board[i][j];
                count = cell.owner == this.activePlayer ? count + 1 : 0;
                won = count == TOKEN_LENGTH_WIN;
            }
        }

        return won;
    }

    checkIfPlayerWonByDiagonalLRDown() {
        let won = false;

        for (let i = 0; i < BOARD_ROW_SIZE && !won; i++) {
            for (let j = 0; j < BOARD_COL_SIZE && !won; j++) {
                won = this.checkDiagonalFromRowAndColWithModifier(i, j, 1);
            }
        }

        return won;
    }

    checkIfPlayerWonByDiagonalRLDown() {
        let won = false;

        for (let i = 0; i < BOARD_ROW_SIZE && !won; i++) {
            for (let j = BOARD_COL_SIZE - 1; j > 0 && !won; j--) {
                won = this.checkDiagonalFromRowAndColWithModifier(i, j, -1);
            }
        }

        return won;
    }

    checkDiagonalFromRowAndColWithModifier(row: number, col: number, modifier: 1 | -1) {
        let won = false;
        let count = 0;

        while (!won && row < BOARD_ROW_SIZE && col >= 0 && col < BOARD_COL_SIZE) {
            const cell = this.board[row][col];
            count = cell.owner == this.activePlayer ? count + 1 : 0;
            won = count == TOKEN_LENGTH_WIN;

            row++;
            col += modifier;
        }

        return won;
    }


    togglePlayer() {
        this.activePlayer = this.activePlayer == "player_1" ? "player_2" : "player_1";
    }

}


class Cell {

    x: number;
    y: number;

    owner: Player;

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.owner = null;
    }

    changePlayer(player: Player) {
        this.owner = player;
    }

    hasToken() {
        return this.owner != null;
    }

}
