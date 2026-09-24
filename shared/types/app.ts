// A condensed version of a race result that's stored as json
export interface RaceResult {
  season: number;
  round: number;
  drivers: {
    positionText: string;
    driverId: string;
    driverName: string;
    constructorName: string;
  }[];
}

export type Driver = [
  string,
  [
    string,
    [
      string,
      number[]
    ][]
  ][]
]


// For the paths between drivers that's returned to the user
export interface ExpandedPath {
  start: string;
  end: string;
  teams: {
    constructorName: string;
    seasons: number[];
  }[];
}

interface ErrorPaths {
  error: true;
  message: string;
}

interface SuccessPaths{
  error: false;
  paths: ExpandedPath[][]
}

export type SolutionResults = ErrorPaths | SuccessPaths;