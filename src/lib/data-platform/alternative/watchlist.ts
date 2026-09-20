/**
 * Drawdown Intelligence Data Platform — Strategic Geographic Watchlist
 *
 * Controlled registry of key physical infrastructure nodes:
 *  - Maritime Chokepoints
 *  - Global Refining & Storage Hubs
 *  - LNG Export Terminals
 *  - Major Commodity Ports
 *  - Key Agricultural Crop Belts
 *  - Strategic Mines
 *
 * Each node maps directly to tradeable commodities, instruments, and spatial coordinates.
 */

import type { GeographicWatchlistNode, GeoCoordinates } from "./types.ts";

export const STRATEGIC_NODES: Record<string, GeographicWatchlistNode> = {
  "node:strait-of-hormuz": {
    id: "node:strait-of-hormuz",
    name: "Strait of Hormuz",
    type: "maritime_chokepoint",
    countryCode: "OM",
    coordinates: { latitude: 26.5667, longitude: 56.25 },
    boundingBox: { north: 27.2, south: 25.8, east: 57.0, west: 55.5 },
    relatedCommodities: ["comm:crude-brent", "comm:crude-wti", "comm:lng"],
    relatedInstruments: ["inst:cl", "inst:bno", "inst:ung"],
    importance: "CRITICAL",
    description: "Key petroleum chokepoint handling ~21 million barrels/day (~21% of global petroleum liquids consumption).",
  },

  "node:bab-el-mandeb": {
    id: "node:bab-el-mandeb",
    name: "Bab el-Mandeb / Red Sea",
    type: "maritime_chokepoint",
    countryCode: "DJ",
    coordinates: { latitude: 12.5833, longitude: 43.3333 },
    boundingBox: { north: 13.5, south: 12.0, east: 44.0, west: 42.5 },
    relatedCommodities: ["comm:crude-brent", "comm:container-freight", "comm:lng"],
    relatedInstruments: ["inst:cl", "inst:bno"],
    importance: "CRITICAL",
    description: "Southern gateway to Suez Canal connecting the Indian Ocean to the Mediterranean Sea.",
  },

  "node:suez-canal": {
    id: "node:suez-canal",
    name: "Suez Canal",
    type: "maritime_chokepoint",
    countryCode: "EG",
    coordinates: { latitude: 30.5852, longitude: 32.2654 },
    boundingBox: { north: 31.3, south: 29.8, east: 32.6, west: 32.0 },
    relatedCommodities: ["comm:crude-brent", "comm:container-freight", "comm:refined-products"],
    relatedInstruments: ["inst:cl", "inst:bno"],
    importance: "CRITICAL",
    description: "Critical artificial maritime passage linking the Mediterranean and Red Sea.",
  },

  "node:malacca-strait": {
    id: "node:malacca-strait",
    name: "Strait of Malacca",
    type: "maritime_chokepoint",
    countryCode: "MY",
    coordinates: { latitude: 4.0, longitude: 100.0 },
    boundingBox: { north: 6.0, south: 1.0, east: 104.0, west: 95.0 },
    relatedCommodities: ["comm:crude-brent", "comm:lng", "comm:palm-oil"],
    relatedInstruments: ["inst:cl"],
    importance: "CRITICAL",
    description: "Main shipping channel between the Indian Ocean and the Pacific Ocean, linking Middle East oil to Asian consumers.",
  },

  "node:panama-canal": {
    id: "node:panama-canal",
    name: "Panama Canal",
    type: "maritime_chokepoint",
    countryCode: "PA",
    coordinates: { latitude: 9.08, longitude: -79.68 },
    boundingBox: { north: 9.4, south: 8.8, east: -79.4, west: -80.0 },
    relatedCommodities: ["comm:lng", "comm:grain", "comm:container-freight"],
    relatedInstruments: ["inst:ung", "inst:zw", "inst:zc"],
    importance: "CRITICAL",
    description: "Passage connecting the Atlantic and Pacific oceans, highly sensitive to freshwater reservoir levels.",
  },

  "node:cushing-hub": {
    id: "node:cushing-hub",
    name: "Cushing Oklahoma Storage Hub",
    type: "storage_hub",
    countryCode: "US",
    coordinates: { latitude: 35.9839, longitude: -96.7672 },
    boundingBox: { north: 36.1, south: 35.8, east: -96.6, west: -96.9 },
    relatedCommodities: ["comm:crude-wti"],
    relatedInstruments: ["inst:cl", "inst:uso"],
    importance: "CRITICAL",
    description: "The primary designated delivery point and price settlement hub for NYMEX WTI crude oil futures.",
  },

  "node:ras-tanura": {
    id: "node:ras-tanura",
    name: "Ras Tanura Terminal & Refinery",
    type: "oil_refinery",
    countryCode: "SA",
    coordinates: { latitude: 26.6444, longitude: 50.1583 },
    boundingBox: { north: 26.8, south: 26.5, east: 50.3, west: 50.0 },
    relatedCommodities: ["comm:crude-arab-light", "comm:crude-brent"],
    relatedInstruments: ["inst:cl", "inst:bno"],
    importance: "CRITICAL",
    description: "The world's largest offshore oil loading facility and crude export port, operated by Saudi Aramco.",
  },

  "node:port-of-rotterdam": {
    id: "node:port-of-rotterdam",
    name: "Port of Rotterdam (ARA Hub)",
    type: "major_port",
    countryCode: "NL",
    coordinates: { latitude: 51.9054, longitude: 4.4666 },
    boundingBox: { north: 52.0, south: 51.8, east: 4.6, west: 4.0 },
    relatedCommodities: ["comm:crude-brent", "comm:diesel", "comm:chemical"],
    relatedInstruments: ["inst:bno"],
    importance: "HIGH",
    description: "Largest seaport in Europe; critical pricing node for European refined petroleum and petrochemicals.",
  },

  "node:freeport-lng": {
    id: "node:freeport-lng",
    name: "Freeport LNG Export Terminal",
    type: "lng_export_terminal",
    countryCode: "US",
    coordinates: { latitude: 28.9486, longitude: -95.3122 },
    boundingBox: { north: 29.0, south: 28.9, east: -95.25, west: -95.35 },
    relatedCommodities: ["comm:natural-gas", "comm:lng"],
    relatedInstruments: ["inst:ng", "inst:ung"],
    importance: "HIGH",
    description: "Major U.S. Gulf Coast liquefaction facility representing ~15-20% of U.S. LNG export capacity.",
  },

  "node:us-corn-belt": {
    id: "node:us-corn-belt",
    name: "U.S. Midwest Corn Belt",
    type: "agricultural_crop_belt",
    countryCode: "US",
    coordinates: { latitude: 41.5, longitude: -93.5 },
    boundingBox: { north: 43.5, south: 39.0, east: -87.0, west: -97.0 },
    relatedCommodities: ["comm:corn", "comm:soybeans"],
    relatedInstruments: ["inst:zc", "inst:zs"],
    importance: "HIGH",
    description: "Dominant Midwest agricultural region (Iowa, Illinois, Indiana) producing the majority of U.S. corn and soy.",
  },

  "node:escondida-copper": {
    id: "node:escondida-copper",
    name: "Minera Escondida",
    type: "metal_mine",
    countryCode: "CL",
    coordinates: { latitude: -24.2667, longitude: -69.0667 },
    boundingBox: { north: -24.1, south: -24.4, east: -68.9, west: -69.2 },
    relatedCommodities: ["comm:copper"],
    relatedInstruments: ["inst:hg", "inst:cper"],
    importance: "STRATEGIC",
    description: "The world's highest producing copper mine, situated in the Atacama Desert in northern Chile.",
  },
};

export class GeographicWatchlist {
  /**
   * Returns all watchlist nodes.
   */
  static getAllNodes(): GeographicWatchlistNode[] {
    return Object.values(STRATEGIC_NODES);
  }

  /**
   * Retrieves a node by its ID.
   */
  static getNode(nodeId: string): GeographicWatchlistNode | undefined {
    return STRATEGIC_NODES[nodeId];
  }

  /**
   * Finds any node whose bounding box encapsulates the given coordinates.
   */
  static findNodeByCoordinates(coords: GeoCoordinates): GeographicWatchlistNode | undefined {
    for (const node of Object.values(STRATEGIC_NODES)) {
      if (node.boundingBox) {
        const { north, south, east, west } = node.boundingBox;
        if (
          coords.latitude <= north &&
          coords.latitude >= south &&
          coords.longitude <= east &&
          coords.longitude >= west
        ) {
          return node;
        }
      }
    }
    return undefined;
  }

  /**
   * Returns all nodes related to a commodity.
   */
  static getNodesByCommodity(commodityId: string): GeographicWatchlistNode[] {
    return Object.values(STRATEGIC_NODES).filter(n =>
      n.relatedCommodities.includes(commodityId)
    );
  }
}
