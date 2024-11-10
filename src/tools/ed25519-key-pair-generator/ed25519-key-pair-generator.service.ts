import sshpk from 'sshpk';

export { generateKeyPair };

async function generateKeyPair(config: {
  password?: string
  format?: sshpk.PrivateKeyFormatType
  comment?: string
} = {}) {
  const privKey = sshpk.generatePrivateKey('ed25519');
  privKey.comment = config?.comment;

  const pubFormat = config.format ?? 'ssh';
  let privFormat: sshpk.PrivateKeyFormatType = config.format ?? 'ssh';
  if (privFormat === 'ssh') {
    privFormat = 'ssh-private';
  }
  const pubKey = privKey.toPublic();
  return {
    publicKey: pubKey.toString(pubFormat),
    privateKey: config?.password
      ? privKey.toString(privFormat,
        {
          passphrase: config?.password,
          comment: config?.comment,
        },
      )
      : privKey.toString(privFormat, { comment: config?.comment }),
  };
}