/* 
  Types related to the Jolpi F1 API
  Sample API call: https://api.jolpi.ca/ergast/f1/2026/results.json?limit=100&offset=0
*/
export interface JolpiResults {
  MRData: {
    total: string;
    RaceTable: {
      season: string;
      Races: {
        season: string;
        round: string;
        raceName: string; 
        Results: {
          positionText: string;
          Driver: {
            driverId: string;
            givenName: string;
            familyName: string;
          };
          Constructor: {
            name: string;
          };
          status: string;
        }[];
      }[];
    };
  };
}
