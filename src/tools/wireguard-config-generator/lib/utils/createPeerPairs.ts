import type { WgConfigPeer } from '../types/WgConfigObject';
import type { WgConfig } from '../WgConfig';

interface CreatePeerPairsOptions {
  /** The config to derive public key from for the peer */
  config: WgConfig
  /** The peer settings to apply when adding this config as a peer */
  peerSettings: Omit<WgConfigPeer, 'publicKey'> | ((args: { thisConfig: WgConfig; peerConfig: WgConfig }) => Omit<WgConfigPeer, 'publicKey'>)
}

/**
 * Create peer pairs from more than one WgConfig object.
 *
 * Will add wgConfigs[0] as a peer in wgConfigs[1] and wgConfigs[1] as a peer in wgConfigs[0] etc.
 * Will fail and error if
 */
export function createPeerPairs(pairs: CreatePeerPairsOptions[]) {
  for (let i = 0; i < pairs.length; i++) {
    const thisConfig = pairs[i];
    for (let subI = 0; subI < pairs.length; subI++) {
      const peerConfig = pairs[subI];
      if (thisConfig.config.publicKey === peerConfig.config.publicKey) {
        continue;
      }
      const peerSettings = typeof peerConfig.peerSettings === 'function'
        ? peerConfig.peerSettings({ thisConfig: thisConfig.config, peerConfig: peerConfig.config })
        : peerConfig.peerSettings;
      const thisConfigPreSharedKey = thisConfig.config.preSharedKey;
      if (thisConfigPreSharedKey) {
        peerSettings.preSharedKey = thisConfigPreSharedKey;
      }
      const peer = peerConfig.config.createPeer(peerSettings);
      thisConfig.config.addPeer(peer, { mergeAllowedIps: false });
    }
  }
}
