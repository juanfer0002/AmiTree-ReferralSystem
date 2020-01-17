import { Component, OnInit } from '@angular/core';

type TokenType = 'player_1' | 'player_2' | 'none';

const BOARD_SQUARE_SIZE = 8;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    selectedToken: Position = null;
    activePlayer: TokenType = 'player_1';

    currentLeftMoves: Position[] = null;
    currentRightMoves: Position[] = null;

    board: Position[][] = [];

    constructor() {
        this.initBoard();
        this.restartGame();
    }

    ngOnInit() {
    }

    initBoard() {
        for (let i = 0; i < BOARD_SQUARE_SIZE; i++) {
            const row = [];
            this.board.push(row);

            for (let j = 0; j < BOARD_SQUARE_SIZE; j++) {
                row.push(new Position(i, j));
            }
        }
    }

    restartGame() {
        this.placeStartingToken(0, 'player_1');
        this.placeStartingToken(5, 'player_2');

    }

    placeStartingToken(startRow: number, player: TokenType) {
        let modParity = player == 'player_1' ? 0 : 1;

        for (let i = 0, nextRow = startRow; i < 3 && nextRow < this.board.length; i++ , nextRow++) {

            for (let j = modParity; j < this.board[i].length; j += 2) {
                const position = this.board[nextRow][j];
                position.tokenType = player;
            }

            modParity = (modParity + 1) % 2;
        }
    }

    doProperActionBasedOnCellContent(item: Position) {
        if (item.tokenType == this.activePlayer && item.hasToken) {
            this.selectToken(item)
        } else if (item.isHighlight()) {
            this.moveSelectedToken(item);
        }
    }

    selectToken(token: Position) {
        this.selectedToken = token;

        this.clearMoves();
        this.highlightAllPossibleMoves(token, this.activePlayer);
        console.log('finishing');
    }

    toggleActivePlayer() {
        this.activePlayer = this.activePlayer == 'player_1' ? 'player_2' : 'player_1';
    }

    clearMoves() {
        for (let i = 0; i < BOARD_SQUARE_SIZE; i++) {
            for (let j = 0; j < BOARD_SQUARE_SIZE; j++) {
                this.board[i][j].setProperColor();
            }
        }
    }

    highlightAllPossibleMoves(pos: Position, player: TokenType) {
        const modifier = this.getPlayerPositionModifier(player);
        let startX = pos.x + modifier;
        let startLeftY = pos.y + 1;
        let nextRightY = pos.y - 1;

        // this.currentLeftMoves = this.calculateAllLeftMoves(startX, startLeftY, 'L', modifier);
        this.currentRightMoves = this.calculateAllLeftMoves(startX, nextRightY, 'R', modifier);
    }

    calculateAllLeftMoves(startX: number, startY: number, directionModifier: 'R' | 'L', modifier: number) {
        const moves: Position[] = [];
        const dirModifierValue = directionModifier == 'R' ? -1 : 1;

        let nextX = startX;
        let nextY = startY;


        while (nextX >= 0 && nextX < this.board.length && nextY >= 0 && nextY < this.board[nextX].length) {
            const pos = this.board[nextX][nextY];
            moves.push(pos);

            nextX += modifier;
            nextY += dirModifierValue;
        }

        const realMoves = this.stripToRealMoves(moves);
        this.doHighlightToMoves(realMoves);
        return realMoves;
    }

    stripToRealMoves(moves: Position[]) {

        let idxToSubstringUntil: number = null;
        for (let i = 0; i < moves.length && idxToSubstringUntil === null; i++) {
            const move = moves[i];

            if (!move.hasToken && i == 0) {
                idxToSubstringUntil = 1;
            } else if (move.hasToken && move.tokenType == this.activePlayer) {
                idxToSubstringUntil = (i - 1) < 0 ? 0 : (i - 1);
            } else if (move.hasToken) {
                const nextMove = moves[i + 1];
                if (nextMove && nextMove.hasToken) {
                    idxToSubstringUntil = i;
                }
            }
        }

        return moves.slice(0, idxToSubstringUntil || 0);
    }

    doHighlightToMoves(moves: Position[]) {
        moves.forEach(m => !m.hasToken && m.hightlight());
    }

    getPlayerPositionModifier(player: TokenType) {
        return (player == 'player_1' ? 1 : -1);
    }

    moveSelectedToken(newPosition: Position) {
        newPosition.tokenType = this.selectedToken.tokenType;
        this.selectedToken.tokenType = 'none';

        this.selectedToken = null;

        this.clearMoves();
        this.toggleActivePlayer();
    }

}

class Move {
    position: Position;
    nextRightMove?: Move = null;
    nextLeftMove?: Move = null;
}

class Position {
    readonly x: number;
    readonly y: number;

    private _tokenType: TokenType;
    private _tokenColor: 'red' | 'blue';

    private _color: 'black' | 'white' | 'hightlight';

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.setProperColor();
        this._tokenType = 'none';
    }

    set tokenType(tokenType: TokenType) {
        this._tokenType = tokenType;
        this._tokenColor = tokenType == "player_1" ? 'red' : 'blue';
    }

    get tokenType() {
        return this._tokenType;
    }

    get hasToken() {
        return this._tokenType != 'none';
    }

    get tokenColor() {
        return this._tokenColor;
    }

    get color() {
        return this._color;
    }

    hightlight() {
        this._color = 'hightlight';
    }

    isHighlight() {
        return this._color == 'hightlight';
    }

    setProperColor() {
        this._color = (this.x + this.y) % 2 == 0 ? 'black' : 'white';
    }
}
