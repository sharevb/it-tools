declare module 'tick-time' {
    export function ticksFromDate(date: Date): string;
    export function ticksToDate(ticks: string): Date;
}