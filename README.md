# Six Degrees of F1
A 'Six Degrees of Separation' finder for F1 drivers. Built with React, Typescript, Node, Vite, and the [Jolpica F1 API](https://github.com/jolpica/jolpica-f1). Deployed to https://six-degrees-of-f1.vercel.app/

## Installation
Install the packages with `npm run install`. Grab the most recent list of teammates by running `npm run prebuild`

## Usage
Start the dev server with `npm run dev`, or `npm run dev:host` to start and expose it to traffic on the same network.

## Fetching driver data
This is a relatively straightforward React/Vite setup, with one exception: There's a Node script we use to call a third-party API and compile a list of each driver and their teammates, then store it as json file which is imported to the React app. It's done like this for two reasons: the data changes at most once per week, and the structure and rate limits of the API we're using don't make it feasable to call it every time two drivers are searched. The script itself is located at `prebuild/fetch.ts` and builds the files at `shared/data/drivers.json` and `shared/data/raceResults.json`. It's automatically run as part of the default build process, but can be manually triggered by running `npm run prebuild`. 

## Automated updates
Automated updates happen on the live server (currently hosted by Vercel) via a cron job. The cron schedule is set in `vercel.json`, and triggers a job in `/api/rebuild` which calls a redeploy hook, the url of which is set as an env variable on Vercel. This rebuilds the app, running `npm run prebuild` to grab the latest content in the process.