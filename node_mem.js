import { totalmem } from 'os';
const memMb = Math.floor(totalmem() / 1024 / 1024);
process.stdout.write(`--max-old-space-size=${memMb - 1024}`);
