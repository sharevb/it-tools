declare module "nestify-anything" {
    export function nestifyObject(
        payload: { [key in string]: unknown }): { [key in string]: unknown };
}