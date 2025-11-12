import JSON5 from 'json5';
import { ethers } from 'ethers';

export function decodeTransaction(abiContract: string, transactionJson: string) {
  const abi = JSON5.parse(abiContract);
  const iface = new ethers.Interface(abi);
  const tx = transactionJson.startsWith('0x')
    ? { data: transactionJson?.trim() }
    : JSON5.parse(transactionJson);

  if (!tx.data || !tx.data.startsWith('0x')) {
    throw new Error('Transaction data must start with 0x');
  }

  const parsed = iface.parseTransaction({ data: tx.data });
  if (parsed === null) {
    return null;
  }

  const types = parsed.fragment.inputs.map((input: any) => input.type);
  const names = parsed!.fragment.inputs.map((input: any) => input.name);
  const inputs = parsed.args.map((arg: any) => {
    if (typeof arg === 'bigint') {
      return { type: 'BigNumber', hex: `0x${arg.toString(16)}` };
    }
    return arg;
  });

  const outputJson = {
    method: parsed.name,
    names,
    types,
    inputs,
  };

  return {
    from: tx.from,
    to: tx.to,
    value: tx.value ? ethers.formatEther(tx.value) : '0',
    gas: tx.gas,
    gasPrice: tx.gasPrice ? `${ethers.formatUnits(tx.gasPrice, 'gwei')} gwei` : undefined,
    nonce: tx.nonce,
    method: parsed.name,
    signature: parsed.signature,
    args: parsed.args,
    fragment: JSON.parse(JSON.stringify(parsed.fragment)),
    outputJson,
  };
}
