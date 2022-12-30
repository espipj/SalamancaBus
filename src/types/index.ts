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
