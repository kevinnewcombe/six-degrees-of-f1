console.log("Running fetch.ts");
import * as fs from "node:fs/promises";
import type { Driver, RaceResult } from "@shared-types/app";
const fetchResults: boolean = true; // set to false for testing other parts of the script
import type { JolpiResults } from "@shared-types/api";

const replaceName = (start: string) => {
  const nameReplacements: [string, string][] = [["Andrea Kimi Antonelli", "Kimi Antonelli"]]; 
  const driverNameReplacement = nameReplacements.find((e) => e[0] == start);
  return driverNameReplacement ? driverNameReplacement[1] : start;
};

let raceResults: RaceResult[] = [];

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const callAPI = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

const addRaces = async (season: number, initialOffset: number = 0) => {
  const limit = 100;
  let offset: number = initialOffset;
  let total: number | undefined;
  while ((total && offset < total) || !total) {
    await sleep(5000);
    const url = `https://api.jolpi.ca/ergast/f1/${season}/results.json?limit=${limit}&offset=${offset}`;
    console.log(
      `Fetching results for ${season}. ${offset}-${total ? Math.min(offset + limit, total) : offset + limit} of ${total ? total : "unknown"}`,
    );
    const results = await callAPI<JolpiResults>(url);
    if (results) {
      const data = results.MRData;
      total = parseInt(data.total);
      for (let i = 0; i < data.RaceTable.Races.length; i++) {
        const race = data.RaceTable.Races[i];
        const season = parseInt(race.season);
        const round = parseInt(race.round);

        const existingRace = raceResults.find((r) => r.round == round && r.season == season);
        if (!existingRace) {
          // it's a new race
          raceResults.push({
            season,
            round,
            drivers: race.Results.map((r) => {
              const { positionText, Driver, Constructor } = r;
              return {
                positionText,
                driverId: Driver.driverId,
                driverName: `${Driver.givenName} ${Driver.familyName}`,
                constructorName: Constructor.name,
              };
            }),
          });
          console.log(`  Added ${season}, round ${round}: ${race.raceName}`);
        } else {
          // The race exists, update the drivers
          const existingDrivers = existingRace.drivers;
          for (let i = 0; i < race.Results.length; i++) {
            const { positionText, Driver, Constructor } = race.Results[i];
            if (!existingDrivers.some((s) => s.driverId == Driver.driverId)) {
              existingDrivers.push({
                positionText,
                driverId: Driver.driverId,
                driverName: `${Driver.givenName} ${Driver.familyName}`,
                constructorName: Constructor.name,
              });
            }
          }
          console.log(`  Updated ${season}, round ${round}: ${race.raceName}`);
          existingRace.drivers = existingDrivers;
        }
      }
      offset += limit;
    } else {
      console.error(`Error results from ${url}`);
    }
  }
  return true;
};
const start = async () => {
  // Get all the races we've fetched already
  const raceResultsPath = "./shared/data/raceResults.json";
  const data = await fs.readFile(raceResultsPath, "utf8");
  raceResults = JSON.parse(data);

  // Get the last season we have results for
  const mostRecentSeason = raceResults.length ? Math.max(...raceResults.map((r) => r.season)) : 1950;
  let resultsOffset = 0;
  if (mostRecentSeason) {
    resultsOffset = raceResults.filter((r) => r.season == mostRecentSeason).reduce((acc, curr) => acc + curr.drivers.length, 0);
  }

  if (fetchResults) { // If the script is set to get new results, get them
    for (let i = mostRecentSeason; i <= new Date().getFullYear(); i++) {
      await addRaces(i, i == mostRecentSeason ? resultsOffset : 0);
      await fs.writeFile(raceResultsPath, JSON.stringify(raceResults));
      console.log(`Added/updated the ${i} season\n`);
    }
    console.log("Finished fetching results");
  }

  // Condense everything into a single array of objects, where each object is a driver and a list of their teammates
  const teammates: Driver[] = [];
  for (let i = 0; i < raceResults.length; i++) {
    const { season, drivers } = raceResults[i];
    for (let j = 0; j < drivers.length; j++) {
      if (drivers[j].positionText != "W") {
        const { constructorName } = drivers[j];
        const driverName = replaceName(drivers[j].driverName);
        if (!driverName || !constructorName) {
          throw new Error(`no startId, driverName, or constructorName found for ${season} round ${raceResults[i].round}`);
        }
        let startDriver = teammates.find((t) => t.driverName == driverName);
        if (!startDriver) {
          teammates.push({
            driverName,
            teammates: [],
          });
          startDriver = teammates[teammates.length - 1];
        }

        const sameConstructors = drivers
          .filter((d) => d.constructorName == constructorName && d.driverName !== driverName && d.positionText !== "W")
          .map((d) => {
            return replaceName(d.driverName);
          });

        // loop through all the current drivers teammates in this race
        for (let k = 0; k < sameConstructors.length; k++) {
          const teammateName = sameConstructors[k];
          if (!teammateName) {
            throw new Error("no teammateId found for " + driverName + " " + season + " round " + raceResults[i].round);
          }
          let currentTeammate = startDriver.teammates.find((d) => d.driverName == teammateName);
          if (!currentTeammate) {
            startDriver.teammates.push({
              driverName: teammateName,
              teams: [],
            });
            currentTeammate = startDriver.teammates[startDriver.teammates.length - 1];
          }

          // check if this is the first time they've driver for the same constructor
          let currentTeam = currentTeammate.teams.find((d) => d.constructorName == constructorName);
          if (!currentTeam) {
            currentTeammate.teams.push({
              constructorName,
              seasons: [],
            });
            currentTeam = currentTeammate.teams[currentTeammate.teams.length - 1];
          }

          if (!currentTeam.seasons.includes(season)) {
            currentTeam.seasons.push(season);
          }
        }
      }
    } // End of looping through drivers in a specific race
  } // End of looping through races

  // Sort drivers by their name
  teammates.sort((a, b) => {
    const c = a.driverName;
    const d = b.driverName;
    if (c < d) {
      return -1;
    } else if (c > d) {
      return 1;
    } else {
      // there shouldn't be drivers with the exact same name, but just in case
      return 0;
    }
  });
  await fs.writeFile("./shared/data/drivers.json", JSON.stringify(teammates.sort((a, b) => a.driverName.localeCompare(b.driverName))));
  console.log(`Wrote to teammates.json`);
  return;
};

start();
