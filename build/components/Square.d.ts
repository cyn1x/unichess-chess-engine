import { IPiece } from './pieces/types';
declare class Square {
    private pos;
    private x;
    private y;
    private w;
    private h;
    private piece;
    private hasPiece;
    private colour;
    private enPassant;
    constructor(pos: string, x: number, y: number, w: number, h: number);
    removePiece(): void;
    squareContainsPiece(): boolean;
    getPiece(): IPiece;
    getPosition(): string;
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
    getColour(): string;
    getEnPassant(): string;
    setX(x: number): void;
    setY(y: number): void;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setPiece(piece: IPiece): void;
    setColour(colour: string): void;
    setEnPassant(enPassant: string): void;
}
export default Square;