import { IPiece } from './pieces/types';
import Board from './Board';
import Square from './Square';
import Player from './Player';
declare class GameLogic {
    private chessboard;
    private player;
    private attackedSquares;
    private bVerifyingRequestedMove;
    private bVerifyingBoardState;
    constructor(chessboard: Board, player: Player);
    checkRequestedMove(attackedSquare: Square): boolean | undefined;
    checkSpecialMove(square: Square): Square | undefined;
    checkMoveSideEffects(activeSquare: Square, attackedSquare: Square): void;
    squareContainsAttack(pos: string, piece: IPiece): void;
    determineMoveCase(pos: string, piece: IPiece): void;
    generalMoveCases(pos: string, piece: IPiece): void;
    knightSpecialCases(pos: string, piece: IPiece): void;
    checkAttackableSquares(file: number, rank: number, piece: IPiece): boolean | undefined;
    checkSquareContainsPiece(piece: IPiece, attackedSquareIndex: number): boolean | undefined;
    bAttackUnoccupiedSquares(piece: IPiece, attackedSquareIndex: number): boolean | undefined;
    bAttackOccupiedSquares(piece: IPiece, attackedSquareIndex: number): boolean | undefined;
    setSquareAttack(attackedSquare: number, piece: IPiece): void;
    determineAttackedSquares(): void;
    verifyRequestedMove(attackedSquare: Square): void;
    playerInCheckDeterminant(piece: IPiece, attackedSquareIndex: number): void;
    determineEnPassantSquare(enPassantSquare: string): void;
    enPassantOpeningDeterminant(attackedSquare: Square): void;
    enPassantCaptureDeteriminant(piece: IPiece): void;
    performEnPassantCapture(attackedSquare: Square): Square;
    kingCanCastleDeterminant(): void;
    rookCanCastleDeterminant(): void;
    playerCanCastleDeterminant(piece: IPiece): void;
    westCastlingDeterminant(pos: string): false | undefined;
    eastCastlingDeterminant(pos: string): false | undefined;
    castleRookQueenSide(square: Square): number;
    castleRookKingSide(square: Square): number;
    bKingPassesThroughAttackedSquare(targetSquareIndex: number, file: number): true | undefined;
    bKingCanCastle(targetSquareIndex: number, file: number): boolean | undefined;
    bCastlingMoveIsObstructed(squaresArray: Array<Square>, targetSquareIndex: number): boolean;
    bRookCanCastle(squaresArray: Array<Square>, targetSquareIndex: number): boolean | undefined;
    bKingInCheck(piece: IPiece, attackedPiece: IPiece): boolean | undefined;
    bIsVerifyingRequestedMove(): boolean;
    bIsVerifyingNewBoardState(): boolean;
    bIsPawn(piece: IPiece): boolean;
    bIsKnight(piece: IPiece): boolean;
    bIsBishop(piece: IPiece): boolean;
    bIsRook(piece: IPiece): boolean;
    bisQueen(piece: IPiece): boolean;
    bIsKing(piece: IPiece): boolean;
    bPawnCanAttack(square: Square, piece: IPiece): boolean;
    clearAttackedSquares(): void;
    getAttackedSquares(): Square[];
    setAttackedSquares(attacked: Array<Square>): void;
    setVerifyingMove(verifying: boolean): void;
    setVerifyingNewBoardState(verifying: boolean): void;
}
export default GameLogic;