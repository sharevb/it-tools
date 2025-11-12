import { describe, expect, it } from 'vitest';
import JSON5 from 'json5';
import { ethers } from 'ethers';
import { decodeTransaction } from './eth-transaction-decoder.service';

// Minimal ABI for testing
const transferAbi = JSON5.stringify([
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]);

describe('decodeTransaction', () => {
  it('decodes a valid transaction', () => {
    const iface = new ethers.Interface(JSON5.parse(transferAbi));
    const data = iface.encodeFunctionData('transfer', [
      '0x000000000000000000000000000000000000dead',
      1000n,
    ]);

    const txJson = JSON5.stringify({
      from: '0x1111111111111111111111111111111111111111',
      to: '0x2222222222222222222222222222222222222222',
      data,
      value: '0',
      gas: '21000',
      gasPrice: ethers.parseUnits('5', 'gwei').toString(),
      nonce: 1,
    });

    const result = decodeTransaction(transferAbi, txJson);

    expect(result).toEqual({
      args: [
        '0x000000000000000000000000000000000000dEaD',
        1000n,
      ],
      fragment: {
        constant: false,
        gas: null,
        inputs: [
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'address',
            components: null,
            name: 'to',
            type: 'address',
          },
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'uint256',
            components: null,
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'bool',
            components: null,
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      from: '0x1111111111111111111111111111111111111111',
      gas: '21000',
      gasPrice: '5.0 gwei',
      method: 'transfer',
      nonce: 1,
      outputJson: {
        inputs: [
          '0x000000000000000000000000000000000000dEaD',
          {
            hex: '0x3e8',
            type: 'BigNumber',
          },
        ],
        method: 'transfer',
        names: [
          'to',
          'amount',
        ],
        types: [
          'address',
          'uint256',
        ],
      },
      signature: 'transfer(address,uint256)',
      to: '0x2222222222222222222222222222222222222222',
      value: '0.0',
    });
  });

  it('decode raw transaction', () => {
    const abi = '[{"constant":false,"inputs":[{"name":"newAddr","type":"address"}],"name":"setFoundationWallet","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalUnrestrictedAssignments","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round0StartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round0Target","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minDonation","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"weiDonated","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"multFracCeiling","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalRestrictedTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round1BonusSteps","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newAuth","type":"address"}],"name":"setExchangeRateAuth","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round1StartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round1EndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxRoundDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"n","type":"uint256"}],"name":"getPhaseStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"time","type":"uint256"}],"name":"getMultiplierAtTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"targetReached","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"finalize","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"assignmentsClosed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"donorList","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"phaseLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"chfCents","type":"uint256"},{"name":"currency","type":"string"},{"name":"memo","type":"bytes32"}],"name":"registerOffChainDonation","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"gracePeriodAfterRound1Target","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalRestrictedAssignments","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"burnMultNom","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"foundationWallet","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"gracePeriodAfterRound0Target","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"finalizeStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"finalizeEndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"donationRound","type":"uint256"},{"name":"dfnAddr","type":"address"},{"name":"fwdAddr","type":"address"}],"name":"getStatus","outputs":[{"name":"currentState","type":"uint8"},{"name":"fxRate","type":"uint256"},{"name":"currentMultiplier","type":"uint256"},{"name":"donationCount","type":"uint256"},{"name":"totalTokenAmount","type":"uint256"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"isTargetReached","type":"bool"},{"name":"chfCentsDonated","type":"uint256"},{"name":"tokenAmount","type":"uint256"},{"name":"fwdBalance","type":"uint256"},{"name":"donated","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"burnMultDen","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"donPhase","type":"uint256"},{"name":"timedelta","type":"uint256"}],"name":"delayDonPhase","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round1Target","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"earlyContribList","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round0EndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isUnrestricted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"restrictions","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"earlyContribShare","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"target","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newAuth","type":"address"}],"name":"setRegistrarAuth","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalUnrestrictedTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"weiPerCHF","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"elapsedTime","type":"uint256"}],"name":"getStepFunction","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateAuth","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"masterAuth","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"time","type":"uint256"},{"name":"n","type":"uint256"}],"name":"isPhase","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registrarAuth","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"restrictedShare","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokensPerCHF","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round1InitialBonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"weis","type":"uint256"}],"name":"setWeiPerCHF","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"N","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"checksum","type":"bytes4"}],"name":"donateAsWithChecksum","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"phaseEndTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"},{"name":"restricted","type":"bool"}],"name":"isRegistered","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"maxDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newAuth","type":"address"}],"name":"setMasterAuth","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"step","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"time","type":"uint256"}],"name":"getPhaseAtTime","outputs":[{"name":"n","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"round0Bonus","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"empty","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"nSteps","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"tokenAmount","type":"uint256"},{"name":"memo","type":"bytes32"}],"name":"registerEarlyContrib","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalWeiDonated","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"millionInCents","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_masterAuth","type":"address"},{"name":"_name","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"currency","type":"string"},{"indexed":true,"name":"bonusMultiplierApplied","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"memo","type":"bytes32"}],"name":"DonationReceipt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"memo","type":"bytes32"}],"name":"EarlyContribReceipt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"tokenAmountBurned","type":"uint256"}],"name":"BurnReceipt","type":"event"}]';
    const rawTransaction = '0x67043cae0000000000000000000000005a9dac9315fdd1c3d13ef8af7fdfeb522db08f020000000000000000000000000000000000000000000000000000000058a20230000000000000000000000000000000000000000000000000000000000040293400000000000000000000000000000000000000000000000000000000000000a0f3df64775a2dfb6bc9e09dced96d0816ff5055bf95da13ce5b6c3f53b97071c800000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000';

    expect(decodeTransaction(abi, rawTransaction)).toEqual({
      args: [
        '0x5A9dAC9315FdD1c3D13eF8Af7FDFEB522Db08F02',
        1487012400n,
        4204852n,
        'BTC',
        '0xf3df64775a2dfb6bc9e09dced96d0816ff5055bf95da13ce5b6c3f53b97071c8',
      ],
      fragment: {
        constant: false,
        gas: null,
        inputs: [
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'address',
            components: null,
            name: 'addr',
            type: 'address',
          },
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'uint256',
            components: null,
            name: 'timestamp',
            type: 'uint256',
          },
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'uint256',
            components: null,
            name: 'chfCents',
            type: 'uint256',
          },
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'string',
            components: null,
            name: 'currency',
            type: 'string',
          },
          {
            arrayChildren: null,
            arrayLength: null,
            baseType: 'bytes32',
            components: null,
            name: 'memo',
            type: 'bytes32',
          },
        ],
        name: 'registerOffChainDonation',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      from: undefined,
      gas: undefined,
      gasPrice: undefined,
      method: 'registerOffChainDonation',
      nonce: undefined,
      outputJson: {
        inputs: [
          '0x5A9dAC9315FdD1c3D13eF8Af7FDFEB522Db08F02',
          {
            hex: '0x58a20230',
            type: 'BigNumber',
          },
          {
            hex: '0x402934',
            type: 'BigNumber',
          }, 'BTC',
          '0xf3df64775a2dfb6bc9e09dced96d0816ff5055bf95da13ce5b6c3f53b97071c8',
        ],
        method: 'registerOffChainDonation',
        names: [
          'addr',
          'timestamp',
          'chfCents',
          'currency',
          'memo',
        ],
        types: [
          'address',
          'uint256',
          'uint256',
          'string',
          'bytes32',
        ],
      },
      signature: 'registerOffChainDonation(address,uint256,uint256,string,bytes32)',
      to: undefined,
      value: '0',
    });
  });

  it('throws if data does not start with 0x', () => {
    const badTx = JSON5.stringify({ data: '1234' });
    expect(() => decodeTransaction(transferAbi, badTx)).toThrowError(
      'Transaction data must start with 0x',
    );
  });
});
