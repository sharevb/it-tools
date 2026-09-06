import { pki } from 'node-forge';
import { generateRSAPairs, getSubjectAlternativeNames } from '@/utils/crypto';

export async function generateCSR(
  config: {
    bits?: number;
    password?: string;
    commonName?: string;
    countryName?: string;
    city?: string;
    state?: string;
    organizationName?: string;
    organizationalUnit?: string;
    subjectAlternativeNames?: string;
    contactEmail?: string;
  } = {},
): Promise<{
  publicKeyPem: string;
  privateKeyPem: string;
  csrPem: string;
}> {
  const { privateKey, publicKey } = await generateRSAPairs(config);

  // create a certification request (CSR)
  const csr = pki.createCertificationRequest();
  csr.publicKey = publicKey;
  csr.setSubject(
    [
      {
        name: 'commonName',
        value: config.commonName,
      },
      {
        name: 'countryName',
        value: config.countryName,
      },
      {
        name: 'stateOrProvinceName',
        value: config.state,
      },
      {
        name: 'localityName',
        value: config.city,
      },
      {
        name: 'organizationName',
        value: config.organizationName,
      },
      {
        name: 'organizationalUnitName',
        value: config.organizationalUnit,
      },
      {
        name: 'emailAddress',
        value: config.contactEmail,
      },
    ].filter((attr) => attr.value !== null && attr.value?.trim() !== ''),
  );

  const extensions = [];
  const sanExtension = getSubjectAlternativeNames(config.subjectAlternativeNames);
  if (sanExtension) {
    extensions.push(sanExtension);
  }
  if (extensions.length) {
    csr.setAttributes([
      {
        name: 'extensionRequest',
        extensions,
      },
    ]);
  }

  // sign certification request
  csr.sign(privateKey);

  // convert certification request to PEM-format
  const csrPem = pki.certificationRequestToPem(csr);

  const privateUnencryptedKeyPem = pki.privateKeyToPem(privateKey);

  return {
    csrPem,
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: config?.password ? pki.encryptRsaPrivateKey(privateKey, config?.password) : privateUnencryptedKeyPem,
  };
}
