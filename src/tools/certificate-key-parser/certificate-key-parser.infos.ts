import type {
  AlgorithmHashType,
  Certificate,
  Fingerprint,
  Key,
  PrivateKey, Signature,
} from 'sshpk';
import 'webcrypto-liner-shim';
import type * as openpgp from 'openpgp';
import * as forge from 'node-forge';
import oids from './oids.json';

import { translate as t } from '@/plugins/i18n.plugin';

export interface LabelValue {
  label: string
  value: string
  multiline?: boolean
}

function onErrorReturnErrorMessage(func: () => any) {
  try {
    return func();
  }
  catch (e: any) {
    return e.toString();
  }
}

function buf2Hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export function getPublicKeyLabelValues(publicKey: Key) {
  return [
    {
      label: t('tools.certificate-key-parser.infos.text.type'),
      value: t('tools.certificate-key-parser.infos.text.public-key'),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-key-type'),
      value: publicKey.type,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-size'),
      value: publicKey.size,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-comment'),
      value: publicKey.comment,
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-curve'),
      value: publicKey.curve ?? 'none',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-sha256'),
      value: onErrorReturnErrorMessage(() => publicKey.fingerprint('sha256')),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-sha512'),
      value: onErrorReturnErrorMessage(() => publicKey.fingerprint('sha512')),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-key-pem'),
      value: onErrorReturnErrorMessage(() => publicKey.toString('pem')),
      multiline: true,
    },
  ] as LabelValue[];
}

export function getPrivateKeyLabelValues(privateKey: PrivateKey) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'Private Key',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-key-type'),
      value: privateKey.type,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-size'),
      value: privateKey.size,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-comment'),
      value: privateKey.comment,
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-curve'),
      value: privateKey.curve,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-sha256'),
      value: onErrorReturnErrorMessage(() => privateKey.fingerprint('sha256')),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-sha512'),
      value: onErrorReturnErrorMessage(() => privateKey.fingerprint('sha512')),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-key-pem'),
      value: onErrorReturnErrorMessage(() => privateKey.toString('pem')),
      multiline: true,
    },
  ] as LabelValue[];
}

export function getCertificateLabelValues(cert: Certificate, forgeCertificate: forge.pki.Certificate | null) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'Certificate',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subjects'),
      value: cert.subjects?.map(s => s.toString()).join('\n'),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-valid-from'),
      value: cert.validFrom.toISOString(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-valid-until'),
      value: cert.validUntil.toISOString(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-issuer'),
      value: cert.issuer.toString(),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subject-key'),
      value: onErrorReturnErrorMessage(() => cert.subjectKey?.toString('ssh')),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subject-key-type'),
      value: cert.subjectKey?.type,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subject-size'),
      value: cert.subjectKey?.size,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subject-comment'),
      value: cert.subjectKey?.comment,
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subject-curve'),
      value: cert.subjectKey?.curve ?? 'none',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-issuer-key'),
      value: onErrorReturnErrorMessage(() => cert.issuerKey?.toString('ssh')),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-serial'),
      value: buf2Hex(cert.serial),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-purposes'),
      value: cert.purposes?.join(', '),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-extensions-parsed'),
      value: JSON.stringify(cert.getExtensions().map(ext => ({
        oid: (<any>ext).oid,
        name: (<any>ext).name || (<any>oids)[(<any>ext).oid],
        critical: (<any>ext).critical,
        data: ext.data?.toString('hex') || (<any>ext).bits?.toString('hex'),
      })), null, 2),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-extensions-raw'),
      value: JSON.stringify(forgeCertificate?.extensions.map(ext => ({
        id: (<any>ext).id,
        name: (<any>ext).id || (<any>oids)[(<any>ext).id],
        ...ext,
      })), null, 2),
      multiline: true,
    },
    ...['sha1', 'sha256', 'sha512'].flatMap(algorithm =>
      [

        {
          label: `Fingerprint (${algorithm}):`,
          value: onErrorReturnErrorMessage(() => cert.fingerprint(algorithm as AlgorithmHashType)),
          multiline: true,
        },
        {
          label: `Fingerprint HEX (${algorithm}):`,
          value: onErrorReturnErrorMessage(() => cert.fingerprint(algorithm as AlgorithmHashType).toString('hex')),
          multiline: true,
        },
      ],
    ),
    {
      label: t('tools.certificate-key-parser.texts.label-certificate-pem'),
      value: onErrorReturnErrorMessage(() => cert.toString('pem')),
      multiline: true,
    },
  ] as LabelValue[];
}

export async function getPGPPublicKeyLabelValuesAsync(pgpPublicKey: openpgp.Key) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'PGP Public Key',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-creation-time'),
      value: pgpPublicKey.getCreationTime().toString(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-expiration-time'),
      value: (await pgpPublicKey.getExpirationTime())?.toString() || '',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-algorithm-info'),
      value: JSON.stringify(pgpPublicKey.getAlgorithmInfo()),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint'),
      value: pgpPublicKey.getFingerprint(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-user-id-s'),
      value: pgpPublicKey.getUserIDs().join(', '),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-key-id-s'),
      value: pgpPublicKey.getKeyIDs().map(k => k.toHex()).join(' ; '),
    },
  ] as LabelValue[];
}

export async function getPGPPrivateKeyLabelValuesAsync(pgpPrivateKey: openpgp.Key) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'PGP Private Key',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-creation-time'),
      value: pgpPrivateKey.getCreationTime().toString(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-expiration-time'),
      value: (await pgpPrivateKey.getExpirationTime())?.toString() || '',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-algorithm-info'),
      value: JSON.stringify(pgpPrivateKey.getAlgorithmInfo()),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint'),
      value: pgpPrivateKey.getFingerprint(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-user-id-s'),
      value: pgpPrivateKey.getUserIDs().join(', '),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-key-id-s'),
      value: pgpPrivateKey.getKeyIDs().map(k => k.toHex()).join(' ; '),
    },
  ] as LabelValue[];
}

export function getCSRLabelValues(csr: forge.pki.CertificateSigningRequest) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'Certificate Signing Request',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-subject'),
      value: csr.subject?.attributes?.map(a => JSON.stringify(a, null, 2)).join('\n'),
      multiline: true,
    },
    // {
    //   label: t('tools.certificate-key-parser.texts.label-request-info'),
    //   value: JSON.stringify(csr.certificationRequestInfo, null, 2),
    //   multiline: true,
    // },
    {
      label: t('tools.certificate-key-parser.texts.label-signature'),
      value: csr.signature?.toString('hex'),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-signature-oid'),
      value: csr.signatureOid?.toString(),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-signature-parameters'),
      value: JSON.stringify(csr.signatureParameters, null, 2),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-signing-info'),
      value: JSON.stringify(csr.siginfo, null, 2),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-extensions'),
      value: JSON.stringify(csr.attributes, null, 2),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-public-key'),
      value: onErrorReturnErrorMessage(() => forge.pki.publicKeyToPem(csr.publicKey as never)),
      multiline: true,
    },
    {
      label: t('tools.certificate-key-parser.texts.label-public-key-fingerprint'),
      value: onErrorReturnErrorMessage(() => forge.pki.getPublicKeyFingerprint(csr.publicKey as never)?.toHex()),
      multiline: true,
    },
  ] as LabelValue[];
}

export function getFingerprintLabelValues(fingerprint: Fingerprint) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'Fingerprint',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-hex'),
      value: fingerprint.toString('hex'),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-base64'),
      value: fingerprint.toString('base64'),
    },
  ] as LabelValue[];
}

export function getSignatureLabelValues(signature: Signature) {
  return [
    {
      label: t('tools.certificate-key-parser.texts.label-type'),
      value: 'Signature',
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-asn1'),
      value: signature.toString('asn1'),
    },
    {
      label: t('tools.certificate-key-parser.texts.label-fingerprint-ssh'),
      value: signature.toString('ssh'),
    },
  ] as LabelValue[];
}
