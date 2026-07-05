declare module 'resistor-data' {
    export function bandsToNotation(bands: string[], bandsCount: number): any[];
    export function notationToBands(notation:any[], bandsCount: number): string[];
    export function notationToValue(notation: string): number;
    export function valueToNotation(value: number): string;
}