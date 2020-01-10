import { IPiece } from './pieces/types';

import Board from './Board';
import Square from './Square';
import Player from './Player';

class GameLogic {
    private chessboard: Board;
    private player: Player;
    private attackedSquares!: Array<Square>;
    private bVerifyingRequestedMove: boolean;

    constructor(chessboard: Board, player: Player) {
        this.chessboard = chessboard;
        this.player = player;
        this.attackedSquares = [];
        this.bVerifyingRequestedMove = false;
    }

    checkRequestedMove(attackedSquare: Square) {
        for (let i = 0; i < this.attackedSquares.length; i++) {
            if (this.attackedSquares[i].getPosition() === attackedSquare.getPosition()) {
                this.verifyRequestedMove(attackedSquare);
                return !this.player.bIsInCheck();
            }
        }
    }

    squareContainsAttack(pos: string, piece: IPiece) {
        if (this.bIsVerifyingRequestedMove()) {
            this.determineMoveCase(pos, piece);
            return;
        }
        
        this.determineMoveCase(pos, piece);
    
        if (this.bIsKing(piece)) {
            this.castlingDeterminant(piece);
        }
        else if (this.bIsPawn(piece)) {
            this.enPassantDeterminant(piece);
        }
    }

    determineMoveCase(pos: string, piece: IPiece) {
        if (this.bIsKnight(piece)) {
            this.knightSpecialCases(pos, piece);
            return;
        }
        
        this.generalMoveCases(pos, piece);
    }

    generalMoveCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoveDirections = piece.getMoveDirections();

        const file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);

        const moveDirections: any = {
            'N': () => (this.checkAttackableSquares(file, rank + currentMove, piece)),
            'S': () => (this.checkAttackableSquares(file, rank - currentMove, piece)),
            'E': () => (this.checkAttackableSquares(file + currentMove, rank, piece)),
            'W': () => (this.checkAttackableSquares(file - currentMove, rank, piece)),
            'NE': () => (this.checkAttackableSquares(file + currentMove, rank + currentMove, piece)),
            'SE': () => (this.checkAttackableSquares(file + currentMove, rank - currentMove, piece)),
            'NW': () => (this.checkAttackableSquares(file - currentMove, rank + currentMove, piece)),
            'SW': () => (this.checkAttackableSquares(file - currentMove, rank - currentMove, piece))
        }

        let currentMove = 0;
        pieceMoveDirections.forEach( (totalMoveCount: number, cardinalDirection: string) => {

            currentMove = 1;
            while (currentMove <= totalMoveCount) {
                if (!moveDirections[cardinalDirection]()) { return; }
                currentMove++;
            }
        })
    }

    knightSpecialCases(pos: string, piece: IPiece) {
        const files = this.chessboard.getFiles();
        const pieceMoves = piece.getMoveDirections();

        const file = files.indexOf(pos[0]);
        const rank = Number(pos[1]);

        const moveDirections: any = {
            'NNE': () => (this.checkAttackableSquares(file + 1, rank + 2, piece)),
            'ENE': () => (this.checkAttackableSquares(file + 2, rank + 1, piece)),
            'ESE': () => (this.checkAttackableSquares(file + 2, rank - 1, piece)),
            'SSE': () => (this.checkAttackableSquares(file + 1, rank - 2, piece)),
            'SSW': () => (this.checkAttackableSquares(file - 1, rank - 2, piece)),
            'WSW': () => (this.checkAttackableSquares(file - 2, rank - 1, piece)),
            'WNW': () => (this.checkAttackableSquares(file - 2, rank + 1, piece)),
            'NWN': () => (this.checkAttackableSquares(file - 1, rank + 2, piece))
        }

        pieceMoves.forEach( (totalMoveCount: number, cardinalDirection: string) => {
            if (!moveDirections[cardinalDirection]()) { return; }
        })
    }

    checkAttackableSquares(file: number, rank: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();
        const files = this.chessboard.getFiles();
        const boardLength = squaresArray.length / 8;
        const attackedSquareIndex = (boardLength - rank) * boardLength + file;
        
        if (attackedSquareIndex < 0 || attackedSquareIndex > squaresArray.length - 1) { return; }
        
        if (squaresArray[attackedSquareIndex].getPosition() === (files[file] + rank)) {
            return this.checkSquareContainsPiece(piece, attackedSquareIndex);
        }
    }

    checkSquareContainsPiece(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        
        if (!squaresArray[attackedSquareIndex].bSquareContainsPiece()) {
            return this.bAttackUnoccupiedSquares(piece, attackedSquareIndex);
        }
        else { this.playerInCheckDeterminant(piece, attackedSquareIndex); }
        
        if (!this.bIsVerifyingRequestedMove()) {
            return this.bAttackOccupiedSquares(piece, attackedSquareIndex);
        }
    }

    bAttackUnoccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (this.bIsPawn(piece) && !this.bPawnCanAttack(squaresArray[attackedSquareIndex], piece)) {
            this.setSquareAttack(attackedSquareIndex, piece);
            return false;
        }
        else {
            if (!this.bIsPawn(piece)) { this.setSquareAttack(attackedSquareIndex, piece); }
        }
        
        if (this.bIsKing(piece)) {
            const attackingPieces = squaresArray[attackedSquareIndex].getAttackingPiece();
            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== piece.getColour()) { return; }
            }
        }
        this.attackedSquares.push(squaresArray[attackedSquareIndex]);
        return true;
    }

    bAttackOccupiedSquares(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();

        if (piece.getColour() === squaresArray[attackedSquareIndex].getPiece().getColour()) {
            this.setSquareAttack(attackedSquareIndex, piece);
            return false;
        }
        if (this.bIsPawn(piece)) {
            if (this.bPawnCanAttack(squaresArray[attackedSquareIndex], piece)) {
                return true;
            }
            else { this.setSquareAttack(attackedSquareIndex, piece); }
        }
        else { this.setSquareAttack(attackedSquareIndex, piece); }

        if (this.bIsKing(squaresArray[attackedSquareIndex].getPiece())) {
            return false;
        }
        
        if (this.bIsKing(piece)) {
            const attackingPieces = squaresArray[attackedSquareIndex].getAttackingPiece();
            for (let i = 0; i < attackingPieces.length; i++) {
                if (attackingPieces[i].getColour() !== piece.getColour()) { return; }
            }
        }
        this.attackedSquares.push(squaresArray[attackedSquareIndex]);
        return false;
    }

    setSquareAttack(attackedSquare: number, piece: IPiece) {
        const squaresArray = this.chessboard.getSquaresArray();

        squaresArray[attackedSquare].setSquareAttacked(true);
        squaresArray[attackedSquare].setAttackingPiece(piece);
    }

    determineAttackedSquares() {
        const squaresArray = this.chessboard.getSquaresArray();

        for (let i = 0; i < squaresArray.length; i++) {
            squaresArray[i].setSquareAttacked(false);
            squaresArray[i].clearAttackingPieces();
        }
        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece()) {
                this.squareContainsAttack(squaresArray[i].getPosition(), squaresArray[i].getPiece());
            }
        }
    }

    verifyRequestedMove(attackedSquare: Square) {
        if (this.player.bIsInCheck()) {
            this.player.setCheckStatus(false);
        }

        const squaresArray = this.chessboard.getSquaresArray();
        const activeSquare = this.chessboard.getActiveSquare();
        const activePiece = activeSquare.getPiece();

        activeSquare.removePiece();
        this.chessboard.setActiveSquare(attackedSquare);
        attackedSquare.setPiece(activePiece);
        this.setVerifyingMove(true);
        this.clearAttackedSquares();

        for (let i = 0; i < squaresArray.length; i++) {
            if (squaresArray[i].bSquareContainsPiece()) {
                this.squareContainsAttack(squaresArray[i].getPosition(), squaresArray[i].getPiece());
            }
        }

        this.clearAttackedSquares();
        attackedSquare.removePiece();
        activeSquare.setPiece(activePiece);
        this.chessboard.setActiveSquare(activeSquare);
        this.setVerifyingMove(false);
        this.squareContainsAttack(activePiece.getPosition(), activePiece);
    }

    playerInCheckDeterminant(piece: IPiece, attackedSquareIndex: number) {
        const squaresArray = this.chessboard.getSquaresArray();
        const attackedPiece = squaresArray[attackedSquareIndex].getPiece();
        
        if (this.bIsKing(attackedPiece) && this.bKingInCheck(piece, attackedPiece)) {
            this.player.setCheckStatus(true);
        }
    }

    castlingDeterminant(piece: IPiece) {
        if (piece.getMoveCount() > 0) { return; }
        
    }

    enPassantDeterminant(piece: IPiece) {
        if (piece.getMoveCount() === 0) { return; }

    }

    bKingInCheck(piece: IPiece, attackedPiece: IPiece) {
        if (this.bIsPawn(piece) && piece.getPosition()[0] === attackedPiece.getPosition()[0]) return;
        return (piece.getColour() !== attackedPiece.getColour() && this.player.getColour() === attackedPiece.getColour());
    }

    bIsVerifyingRequestedMove() { return this.bVerifyingRequestedMove; }

    bIsPawn(piece: IPiece) { return piece.getType() === 'P' || piece.getType() === 'p'; }

    bIsKnight(piece: IPiece) { return piece.getType() === 'N' || piece.getType() === 'n'; }

    bIsBishop(piece: IPiece) { return piece.getType() === 'B' || piece.getType() === 'b'; }

    bIsRook(piece: IPiece) { return piece.getType() === 'R' || piece.getType() === 'r'; }

    bisQueen(piece: IPiece) { return piece.getType() === 'Q' || piece.getType() === 'q'; }

    bIsKing(piece: IPiece) { return piece.getType() === 'K' || piece.getType() === 'k'; }

    bPawnCanAttack(square: Square, piece: IPiece) { return square.getPosition()[0] === piece.getPosition()[0]; }

    clearAttackedSquares() { this.attackedSquares = []; }
 
    getAttackedSquares() { return this.attackedSquares; }

    setAttackedSquares(attacked: Array<Square>) { this.attackedSquares = attacked; }

    setVerifyingMove(verifying: boolean) { this.bVerifyingRequestedMove = verifying; }
    
}

export default GameLogic;
