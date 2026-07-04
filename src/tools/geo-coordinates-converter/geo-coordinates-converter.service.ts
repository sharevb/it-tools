import proj4 from 'proj4';
import proj4List from 'proj4-list';
import type { CRSTypes } from 'gcoord';
import gcoord from 'gcoord';

proj4.defs([
  proj4List['EPSG:4490'],
  proj4List['EPSG:4326'],
]);

export const CGCS2000 = 'EPSG:4490';
export const WGS84 = 'EPSG:4326';

export function convertFrom(source: string, lng: number, lat: number) {
  let wgsLng, wgsLat;
  switch (source) {
    case 'CGCS2000': {
      const [x, y] = proj4(CGCS2000, WGS84, [lng, lat]);
      wgsLng = x;
      wgsLat = y;
      break;
    }
    default: {
      const [x, y] = gcoord.transform(
        [lng, lat],
        ((gcoord as unknown) as Record<string, CRSTypes>)[source] as CRSTypes,
        gcoord.WGS84,
      );
      wgsLng = x;
      wgsLat = y;
    }
  }

  const toLatLng = ([lat, lng]: [number, number]) => ({ lat, lng });
  // Generate all systems from WGS84
  return {
    WGS84: toLatLng([wgsLng, wgsLat]),
    GCJ02: toLatLng(gcoord.transform([wgsLng, wgsLat], gcoord.WGS84, gcoord.GCJ02)),
    BD09: toLatLng(gcoord.transform([wgsLng, wgsLat], gcoord.WGS84, gcoord.BD09)),
    BD09MC: toLatLng(gcoord.transform([wgsLng, wgsLat], gcoord.WGS84, gcoord.BD09MC)),
    WebMerkator: toLatLng(gcoord.transform([wgsLng, wgsLat], gcoord.WGS84, gcoord.WebMercator)),
    CGCS2000: toLatLng(proj4(WGS84, CGCS2000, [wgsLng, wgsLat])),
  };
}
