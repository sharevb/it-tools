declare module 'node-emv' {
    export interface EmvBitDescription {
        bit: string
        description: string
        value: string
    }

    export interface EmvTag {
        tag: string
        length: number
        value: string | EmvTag[]
        description: string
        bitDetails?: string[]
    }

    export function describeKernel(hex: string, kernel: string, callback: (data: EmvTag[]) => void): void;
    export function tvr(hex: string, callback: (data: EmbBitDescription[][]) => void): void;
    export function auc(hex: string, callback: (data: EmbBitDescription[][]) => void): void;
    export function aip(hex: string, callback: (data: EmbBitDescription[][]) => void): void;
    export function tsi(hex: string, callback: (data: EmbBitDescription[][]) => void): void;
    export function cvm(hex: string, callback: (data: string[]) => void): void;
}