/** Defines the VPN settings for the local node. */
export interface WgConfigInterface {
  /**
   * This is just a standard comment in INI syntax used to help keep track of which config section belongs to which node,
   * it's completely ignored by WireGuard and has no effect on VPN behavior.
   */
  name?: string;
  /**
   * Defines what address range the local node should route traffic for.
   * Depending on whether the node is a simple client joining the VPN subnet, or a bounce server that's relaying traffic
   * between multiple clients, this can be set to a single IP of the node itself (specified with CIDR notation),
   * e.g. 192.0.2.3/32), or a range of IPv4/IPv6 subnets that the node can route traffic for.
   */
  address?: string[];
  /**
   * When the node is acting as a public bounce server, it should hardcode a port to listen for incoming VPN connections
   * from the public internet. Clients not acting as relays should not set this value.
   */
  listenPort?: number;
  /**
   * This is the private key for the local node, never shared with other servers.
   * All nodes must have a private key set, regardless of whether they are public bounce servers relaying traffic,
   * or simple clients joining the VPN.
   */
  privateKey?: string;
  /**
   * The DNS server(s) to announce to VPN clients via DHCP, most clients will use this server for DNS requests over the VPN,
   * but clients can also override this value locally on their nodes
   */
  dns?: string[];
  /**
   * Optionally defines which routing table to use for the WireGuard routes, not necessary to configure for most setups.
   * There are two special values:
   * -**‘off’**: disables the creation of routes altogether, and
   * -**‘auto’**: (the default if omitted) adds routes to the default table and enables special handling of default routes.
   */
  table?: string;
  /**
   * Optionally defines the maximum transmission unit (MTU, aka packet/frame size) to use when connecting to the peer,
   * not necessary to configure for most setups. The MTU is automatically determined from the endpoint addresses or
   * the system default route, which is usually a sane choice.
   */
  mtu?: number;
  /**
   * Optionally run bash commands before the interface is brought up.
   * These will be added to the config file in order and executed in order. Position 0 in array will be run first.
   */
  preUp?: string[];
  /**
   * Optionally run bash commands after the interface is brought up.
   * These will be added to the config file in order and executed in order. Position 0 in array will be run first.
   */
  postUp?: string[];
  /**
   * Optionally run bash commands before the interface is brought down.
   * These will be added to the config file in order and executed in order. Position 0 in array will be run first.
   */
  preDown?: string[];
  /**
   * Optionally run bash commands after the interface is brought down.
   * These will be added to the config file in order and executed in order. Position 0 in array will be run first.
   */
  postDown?: string[];
}

/**
 * Defines the VPN settings for a remote peer capable of routing traffic for one or more addresses (itself and/or other peers).
 * Peers can be either a public bounce server that relays traffic to other peers, or a directly accessible client via
 * LAN/internet that is not behind a NAT and only routes traffic for itself.
 */
export interface WgConfigPeer {
  /**
   * This is just a standard comment in INI syntax used to help keep track of which config section belongs to which node,
   * it's completely ignored by WireGuard and has no effect on VPN behavior.
   */
  name?: string;
  /**
   * Defines the publicly accessible address for a remote peer.
   * This should be left out for peers behind a NAT or peers that don't have a stable publicly accessible IP:PORT pair.
   * Typically, this only needs to be defined on the main bounce server, but it can also be defined on other public nodes with stable IPs.
   */
  endpoint?: string;
  /**
   * This defines the IP ranges for which a peer will route traffic.
   * On simple clients, this is usually a single address (the VPN address of the simple client itself).
   * For bounce servers this will be a range of the IPs or subnets that the relay server is capable of routing traffic for.
   */
  allowedIps?: string[];
  /**
   * This is the public key for the remote node, shareable with all peers. All nodes must have a
   * public key set, regardless of whether they are public bounce servers relaying traffic, or simple clients joining the VPN.
   */
  publicKey?: string;
  /**
   * The number of seconds between each keep-alive ping.
   * If the connection is going from a NAT-ed peer to a public peer, the node behind the NAT must regularly send an outgoing
   * ping in order to keep the bidirectional connection alive in the NAT router's connection table.
   */
  persistentKeepalive?: number;
  /**
   * A pre-shared key generated on the remote node to improve security.
   */
  preSharedKey?: string;
  /**
   * Client Assigned IP
   */
  clientAssignedIP?: string;
  /**
   * Client Private Key
   */
  privateKey?: string;
}

/** Defines the WireGuard config for this node */
export interface WgConfigObject {
  /** Defines the VPN settings for the local node. */
  wgInterface: WgConfigInterface;
  /** An array of VPN settings for remote peers */
  peers?: WgConfigPeer[];
  /**
   * A place to keep the public key for this node
   * Usefull when saving this config somewhere where you can't generate the public key
   *
   * Note: the private key for this node should be kept in `interface.privateKey`
   */
  publicKey?: string;
  /**
   * A place to keep the preSharedKey key for this node
   * Usefull when saving this config somewhere where you need to generate peers in future
   */
  preSharedKey?: string;
  /**
   * A place to keep the endpoint key for this node
   * Usefull when saving this config somewhere where you need to generate peers in future
   */
  endpoint?: string;
  /**
   * A place to keep the client AllowedIPs key for this node
   * Usefull when saving this config somewhere where you need to generate peers in future
   */
  clientsAllowedIps?: string[];
}
