import { asn1, md, pki, random, util } from 'node-forge';
import { generateRSAPairs, getSubjectAlternativeNames, toPositiveHex } from '@/utils/crypto';

export async function generateSSLCertificate(config: {
  bits?: number
  password?: string
  commonName?: string
  countryName?: string
  city?: string
  state?: string
  organizationName?: string
  organizationalUnit?: string
  contactEmail?: string
  subjectAlternativeNames?: string
  days?: number
} = {}): Promise<{
  fingerprint: string
  publicKeyPem: string
  privateKeyPem: string
  certificatePem: string
}> {
  const { privateKey, publicKey } = await generateRSAPairs(config);

  const cert = pki.createCertificate();

  cert.serialNumber = toPositiveHex(util.bytesToHex(random.getBytesSync(9))); // the serial number can be decimal or hex (if preceded by 0x)

  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + (config.days || 365));

  const attrs = [{
    name: 'commonName',
    value: config.commonName,
  }, {
    name: 'countryName',
    value: config.countryName,
  }, {
    name: 'stateOrProvinceName',
    value: config.state,
  }, {
    name: 'localityName',
    value: config.city,
  }, {
    name: 'organizationName',
    value: config.organizationName,
  }, {
    name: 'organizationalUnitName',
    value: config.organizationalUnit,
  }, {
    name: 'emailAddress',
    value: config.contactEmail,
  }].filter(attr => attr.value !== null && attr.value?.trim() !== '');

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  const extensions: any[] = [
    {
      name: 'basicConstraints',
      cA: true,
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    }];
  const sanExtension = getSubjectAlternativeNames(config.subjectAlternativeNames);
  if (sanExtension) {
    extensions.push(sanExtension);
  }
  if (extensions.length) {
    cert.setExtensions(extensions);
  }

  cert.publicKey = publicKey;

  cert.sign(privateKey);

  const fingerprint = md.sha1
    .create()
    .update(asn1.toDer(pki.certificateToAsn1(cert)).getBytes())
    .digest()
    .toHex()
    .match(/.{2}/g)?.join(':') ?? '';

  const privateUnencryptedKeyPem = pki.privateKeyToPem(privateKey);

  return {
    fingerprint,
    certificatePem: pki.certificateToPem(cert),
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: config?.password
      ? pki.encryptRsaPrivateKey(privateKey, config?.password)
      : privateUnencryptedKeyPem,
  };
}
