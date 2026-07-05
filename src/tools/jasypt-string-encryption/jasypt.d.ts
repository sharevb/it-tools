declare module 'jasypt' {
  export default class Jasypt {
    setPassword(password: string): void;
    encrypt(value: string): string;
    decrypt(value: string): string;
  }
}
