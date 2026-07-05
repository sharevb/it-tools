declare module "paseto-ts/v4" {
    export type PasetoPurpose = 'local' | 'public';
    export type Assertion = {
        [key: string]: any;
    } | string | Uint8Array;
    export type Payload = {
        [key: string]: any;
        iss?: string;
        sub?: string;
        aud?: string;
        exp?: string;
        nbf?: string;
        jti?: string;
        iat?: string;
    };
    export type Footer = {
        [key: string]: any;
        kid?: string;
        wpk?: string;
    };
    export type GetRandomValues = (array: Uint8Array) => Uint8Array;

    export interface PASERKPublicKeyPair {
        secretKey: string;
        publicKey: string;
    }
    export interface PASERKPublicKeyPairBuffer {
        secretKey: Uint8Array;
        publicKey: Uint8Array;
    }

    export declare function generateKeys(purpose: 'local', opts?: {
        format?: 'paserk';
        getRandomValues?: GetRandomValues;
    }): string;
    export declare function generateKeys(purpose: 'local', opts?: {
        format?: 'buffer';
        getRandomValues?: GetRandomValues;
    }): Uint8Array;
    export declare function generateKeys(purpose: 'public', opts?: {
        format?: 'paserk';
        getRandomValues?: GetRandomValues;
    }): PASERKPublicKeyPair;
    export declare function generateKeys(purpose: 'public', opts?: {
        format?: 'buffer';
        getRandomValues?: GetRandomValues;
    }): PASERKPublicKeyPairBuffer;

    export declare function decrypt<T extends {
        [key: string]: any;
    } = {
        [key: string]: any;
    }>(key: string | Uint8Array, token: string | Uint8Array, { assertion, maxDepth, maxKeys, validatePayload, }?: {
        assertion?: Assertion | string | Uint8Array;
        maxDepth?: number;
        maxKeys?: number;
        validatePayload?: boolean;
    }): {
        payload: Payload & T;
        footer: Footer | string;
    };

    export declare function encrypt(key: string | Uint8Array, payload: Payload | string | Uint8Array, { footer, assertion, addIat, addExp, maxDepth, maxKeys, validatePayload, getRandomValues, }?: {
        footer?: Footer | string | Uint8Array;
        assertion?: Assertion | string | Uint8Array;
        addIat?: boolean;
        addExp?: boolean;
        maxDepth?: number;
        maxKeys?: number;
        validatePayload?: boolean;
        getRandomValues?: GetRandomValues;
    }): string;

    export declare function sign(key: string | Uint8Array, payload: Payload | string | Uint8Array, { footer, assertion, addExp, // Add an exp claim if one is not provided: https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/05-API-UX.md#default-expiration-claims
        addIat, // Add an iat claim if one is not provided
        maxDepth, // Maximum depth of nested objects
        maxKeys, // Maximum number of keys in an object
        validatePayload, }?: {
            footer?: Footer | string | Uint8Array;
            assertion?: Assertion | string | Uint8Array;
            addExp?: boolean;
            addIat?: boolean;
            maxDepth?: number;
            maxKeys?: number;
            validatePayload?: boolean;
        }): string;
        export declare function verify<T extends {
            [key: string]: any;
        } = {
            [key: string]: any;
        }>(key: string | Uint8Array, token: string | Uint8Array, { assertion, maxDepth, maxKeys, validatePayload, }?: {
            assertion?: Assertion | string | Uint8Array;
            maxDepth?: number;
            maxKeys?: number;
            validatePayload?: boolean;
        }): {
            payload: Payload & T;
            footer?: Footer | string;
        };        
}