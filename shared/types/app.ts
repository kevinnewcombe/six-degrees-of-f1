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

export interface Driver {
  driverName: string;
  teammates: {
    driverName: string;
    teams: {
      constructorName: string;
      seasons: number[];
    }[];
  }[];
}

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