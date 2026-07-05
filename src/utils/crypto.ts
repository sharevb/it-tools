import { isIP } from 'is-ip';
import { pki } from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min?url';

export function generateRSAPairs({ bits = 2048 }) {
  return new Promise<pki.rsa.KeyPair>((resolve, reject) =>
    pki.rsa.generateKeyPair({ bits, workerScript }, (err, keyPair) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(keyPair);
    }),
  );
}

// a hexString is considered negative if it's most significant bit is 1
// because serial numbers use ones' complement notation
// this RFC in section 4.1.2.2 requires serial numbers to be positive
// http://www.ietf.org/rfc/rfc5280.txt
export function toPositiveHex(hexString: string) {
  let mostSiginficativeHexAsInt = Number.parseInt(hexString[0], 16);
  if (mostSiginficativeHexAsInt < 8) {
    return hexString;
  }

  mostSiginficativeHexAsInt -= 8;
  return mostSiginficativeHexAsInt.toString() + hexString.substring(1);
}

export const SANType_OtherName = 0; // OtherName,
export const SANType_Rfc822Name = 1; // email address
export const SANType_DNSName = 2; // DNS Name,
export const SANType_X400Address = 3; // ORAddress,
export const SANType_DirectoryName = 4; // Name,
// export const  SANType_EdiPartyName                  =  5;
export const SANType_UniformResourceIdentifier = 6; // URI,
export const SANType_IPAddress = 7; // IP
export const SANType_RegisteredID = 8; // OBJECT IDENTIFIER

export function getSANType(value: string): number {
  if (value?.includes('://')) {
    return SANType_UniformResourceIdentifier;
  }
  if (value?.includes('@')) {
    return SANType_Rfc822Name;
  }
  if (isIP(value)) {
    return SANType_IPAddress;
  }
  if (value?.includes('.') && /^[\*\.a-zA-Z\d-]+$/.test(value)) {
    return SANType_DNSName;
  }
  if (value?.includes('DC=')) {
    return SANType_DirectoryName;
  }
  return SANType_OtherName;
}

export function getSubjectAlternativeNames(values: string | undefined) {
  if (!values?.trim()) {
    return null;
  }
  return {
    name: 'subjectAltName',
    altNames: (values || '').split('\n').map(v => v?.trim()).filter(v => v && v !== '').map((v) => {
      const valueType = getSANType(v.trim());
      if (valueType === SANType_IPAddress) {
        return {
          type: valueType,
          ip: v.trim(),
        };
      }
      return {
        type: valueType,
        value: v.trim(),
      };
    }),
  };
}
