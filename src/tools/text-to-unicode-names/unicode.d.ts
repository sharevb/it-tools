// Shouldn't be necessary but type checking is currently not picking up the JSR module
// Can probably be removed once dev dependencies are updated
declare module '@li/unicode-names'{
  const getUnicodeNames: (data: Promise<Uint8Array | Response>) => Promise<{
    getByCodePoint: (codePoint: number) => string | undefined;
  }>;
  export { getUnicodeNames };
}
