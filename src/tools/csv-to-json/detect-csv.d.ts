declare module "detect-csv" {
    export default function DetectCSV(content: string): Nullable<{
        delimiter: string
        newline: string
    }>
}