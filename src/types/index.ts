export interface Line {
  id: string;
  name: string;
  stops: Stop[];
}

export interface Stop {
  id: string;
  name: string;
}

export interface Bus {
  line: string;
  direction: string;
  time: Date;
}

export interface StopOSM {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Tags;
}

export interface Tags {
  bus: string;
  highway: string;
  lit?: string;
  name?: string;
  operator?: string;
  public_transport: string;
  ref?: string;
  tactile_paving?: string;
  bench?: string;
  bin?: string;
  shelter?: string;
  mapillary?: string;
  pole?: string;
  'survey:date'?: Date;
  departures_board?: string;
  start_date?: Date;
}

export interface GeoPoint extends Pick<StopOSM, 'lat' | 'lon'> {}
