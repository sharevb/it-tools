declare module 'run-pace' {
    export function calculatePace(options: {
        time: string;
        length: string;
        imperial?: boolean;
        metric?: boolean;
        speed?: boolean;
    }): string;
    export function calculateLength(options: {
        time: string;
        pace: string;
        imperial?: boolean;
        metric?: boolean;
    }): string;
    export function calculateTime(options: {
        length: string;
        pace: string;
        imperial?: boolean;
        metric?: boolean;
    }): string;
    export function paceToSpeed(options: {
        pace: string;
        imperial?: boolean;
        metric?: boolean;
    }): string;
}