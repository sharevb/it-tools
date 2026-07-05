declare module 'creditcard' {
    export function parse(creditCardNumber: string): {
        formatted: string
        truncate: string
        scheme: string
        mii: string
        iin: string
        validates: boolean
        cvv: number
    }
}