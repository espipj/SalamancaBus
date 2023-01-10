import {GeoPoint, Stop, StopOSM} from '../types';
import tDistance from '@turf/distance';
export const osmToStandard = (stop: StopOSM): Stop => {
  return {id: stop.tags.ref, name: stop.tags.name};
};

export const distance = (point1: GeoPoint, point2: GeoPoint): number => {
  return tDistance([point1.lat, point1.lon], [point2.lat, point2.lon], {
    units: 'kilometers',
  });
};
