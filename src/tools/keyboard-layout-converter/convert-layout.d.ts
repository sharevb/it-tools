declare module '@langfreak/convert-layout' {
    const layouts: Record<string, {
        fromEn: (s: string) => string
        toEn: (s: string) => string
    }>;
    export default layouts;
}