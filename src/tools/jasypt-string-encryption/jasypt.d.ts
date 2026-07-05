declare module 'jasypt' {
    export default class Jasypt {
        constructor() {}
        setPassword(password: string): void
        encrypt(value: string): string
        decrypt(value: string): string
    }
}