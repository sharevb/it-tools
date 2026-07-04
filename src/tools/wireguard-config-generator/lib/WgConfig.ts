import mergeWith from 'lodash.mergewith';
import { generateConfigString, parseConfigString } from './utils/configParser';
import type { WgConfigObject, WgConfigPeer } from './types/WgConfigObject';
import { generateKeyPair } from './utils/generateKeyPair';

interface GenerateKeysOptions {
  /** Also create a preshared key */
  preSharedKey?: boolean
  /**
   * Overwrite this object's private key if it already exists
   *
   * If this is not set to true, a new public key will be generated from the existing private key if
   * the private key exists.
   */
  overwrite?: boolean
}

/** A Javascript object representation of a WireGuard config file with some extras */
export class WgConfig implements WgConfigObject {
  /** Defines the VPN settings for the local node. */
  wgInterface: WgConfigObject['wgInterface'] = {};
  /** An array of VPN settings for remote peers */
  peers: WgConfigObject['peers'];
  /** A place to keep the public key for this node (it's not saved in the WireGuard config) */
  publicKey: WgConfigObject['publicKey'];
  /** A place to keep the pre-shared key for this node (it's not saved in the WireGuard config) */
  preSharedKey: WgConfigObject['preSharedKey'];
  /** A place to keep the endpoint for this node (it's not saved in the WireGuard config) */
  endpoint: WgConfigObject['endpoint'];
  /** A place to keep the client AllowedIPs for this node (it's not saved in the WireGuard config) */
  clientsAllowedIps: WgConfigObject['clientsAllowedIps'];

  /** creates a new WgConfig */
  constructor(init: Partial<WgConfigObject>) {
    if (init?.wgInterface) {
      this.wgInterface = init.wgInterface;
    }
    this.peers = init?.peers || [];
    this.preSharedKey = init?.preSharedKey;
    this.publicKey = init?.publicKey;
  }

  /** Return a string akin to a WireGuard config file from this WgConfig object */
  toString() {
    return generateConfigString(this);
  }

  /** JSON.stringify this WgConfig object */
  toJson() {
    return JSON.stringify(this);
  }

  /** Parse a WireGuard config file in the form of a string into this WgConfig object */
  parse(configAsString: string) {
    const parsedObj = parseConfigString(configAsString);
    Object.assign(this, parsedObj);
  }

  /** Generate a public/private key pair for this WgConfig object */
  generateKeys(opts?: GenerateKeysOptions) {
    const overwrite = opts?.overwrite;
    const privateKey = overwrite ? undefined : this.wgInterface?.privateKey;
    const keys = generateKeyPair({ privateKey, preSharedKey: opts?.preSharedKey ?? false });
    this.publicKey = keys.publicKey;
    this.wgInterface.privateKey = keys.privateKey;
    this.preSharedKey = keys.preSharedKey;
    return keys;
  }

  /**
   * Add a peer to the peers for this WgConfig.
   *
   * If the peer already exists (found by public key) then it will be updated by merging the
   * existing with the new. The allowedIps will be replaced by the new peer's allowedIps unless
   * { mergeAllowedIps: true } is passed in as settings
   */
  addPeer(peer: WgConfigPeer, settings?: { mergeAllowedIps?: boolean }) {
    const mergeAllowedIps = settings?.mergeAllowedIps;
    if (!this.peers) {
      this.peers = [];
    }
    // check if peer exists by public key
    const i = this.peers.map(x => x.publicKey).indexOf(peer.publicKey);
    if (i === -1) {
      this.peers.push(peer);
    }
    else {
      mergeWith(this.peers[i], peer, (objValue: any, srcValue: any, key: string) => {
        if (key === 'allowedIps' && Array.isArray(objValue) && Array.isArray(srcValue)) {
          return mergeAllowedIps ? [...new Set([...objValue, ...srcValue])] : srcValue;
        }
      });
    }
  }

  /**
   * Remove a peer if it exists in the peer array by its public key
   */
  removePeer(publicKey: string) {
    if (!this.peers) {
      this.peers = [];
    }
    const i = this.peers.map(x => x.publicKey).indexOf(publicKey);
    if (i !== -1) {
      this.peers.splice(i, 1);
    }
  }

  /** Creates a WfgConfigPeer object from this WgCongig object */
  createPeer(settings: WgConfigPeer) {
    const keys = generateKeyPair({ privateKey: undefined, preSharedKey: !!this.preSharedKey });
    const peer: WgConfigPeer = {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      preSharedKey: this.preSharedKey,
      endpoint: this.endpoint,
      allowedIps: this.clientsAllowedIps,
      ...settings,
    };
    return peer;
  }

  /** Get a peer from the peer array by it's public key */
  getPeer(publicKey: string) {
    if (!publicKey) {
      return undefined;
    }
    if (!this.peers || !this.peers.length) {
      return undefined;
    }
    return this.peers.find(x => x.publicKey === publicKey);
  }

  clearPeers() {
    this.peers = [];
  }
}
