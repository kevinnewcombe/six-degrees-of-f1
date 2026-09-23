import type { Driver, ExpandedPath, SolutionResults } from "@shared-types/app";
import driverListRaw from "@data/drivers.json";
const driverList: Driver[] = driverListRaw;
const solveCache = new Map<string, SolutionResults>();
export const solve = (start: string, end: string): SolutionResults => {
  const cacheKey = `${start}|${end}`;
  const cached = solveCache.get(cacheKey);
  if (cached) return cached;

  // Confirm the names searched are actual drivers
  const invalidDrivers: string[] = [];
  if (!driverList.some((d) => d.driverName == start)) {
    invalidDrivers.push(start);
  }
  if (!driverList.some((d) => d.driverName == end)) {
    invalidDrivers.push(end);
  }
  if (invalidDrivers.length) {
    return {
      error: true,
      message: `There ${invalidDrivers.length == 1 ? "is no record" : "are no records"} for ${invalidDrivers.join(" or ")}.`,
    };
  }

  const checkedDrivers: string[] = []; // Ids to ignore because we've already checked them 
  const allDrivers: string[][] = []; // Possible paths
  let currentPaths: string[][] = []; // The paths we're currently checking
  let nextPaths: string[][] = []; // The paths that are queued up to be checked in the next depth

  let isSolved: boolean = false;

  currentPaths.push([start]); // Start by checking direct teammates of the start driver

  let currentDepth = 0;
  while (!isSolved) {
    currentDepth++;
    while (currentPaths.length) {
      const driver = currentPaths.shift();
      if (driver) {
        allDrivers.push(driver);
        checkedDrivers.push(driver[driver.length - 1]);
        const teammates = driverList.find((e) => e.driverName == driver[driver.length - 1]);
        if (teammates) {
          if (teammates.teammates) {
            teammates.teammates.forEach((teammate) => {
              const currentDriverObj = driver.concat([teammate.driverName]);
              if (teammate.driverName == end) {
                isSolved = true; // We've found a path
                allDrivers.push(currentDriverObj);
              } else {
                if (!checkedDrivers.includes(teammate.driverName)) {
                  // If it's a new driver, push them into the queue
                  nextPaths.push(currentDriverObj);
                }
              }
            });
          }
        }
      }
    }

    // Put the next depth drivers into the queue
    currentPaths = nextPaths;
    nextPaths = [];

    // Even if we haven't found a connection, end the loop when we've run out 
    // of teammate to check or we've hit a depth of 15, which might be a sign of
    // an infinite loop
    if ((!isSolved && currentDepth == 15) || currentPaths.length == 0) {
      return {
        error: true,
        message: `A path can't be found between ${start} and ${end}.`,
      };
    }
  }

  const validPaths = allDrivers.filter((d) => d[d.length - 1] == end); // All the paths connecting start to end
  const expandedPaths: ExpandedPath[][] = [];
  validPaths.forEach((p) => {
    const path: ExpandedPath[] = [];
    for (let i = 0; i < p.length - 1; i++) {
      const start = driverList.find((d) => d.driverName == p[i]);
      const endId = p[i + 1];
      const end = driverList.find((d) => d.driverName == endId);
      if (start && end) {
        const teammate = start.teammates.find((t) => t.driverName == endId);
        if (teammate) {
          path.push({
            start: start.driverName,
            end: end.driverName,
            teams: teammate.teams,
          });
        }
      }
    }
    expandedPaths.push(path);
  });

  const result: SolutionResults = { error: false, paths: expandedPaths };
  solveCache.set(cacheKey, result);
  return result;
};

export default solve;
