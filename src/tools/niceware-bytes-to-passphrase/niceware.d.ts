declare module 'niceware' {
    export function bytesToPassphrase(bytes: Uint8Array): string[];
    export function passphraseToBytes(words: string[]): Uint8Array;
}