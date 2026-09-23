import { solve } from "./solve";
import type { SolutionResults } from "@shared-types/app";

export interface WorkerResults {
  start: string;
  end: string;
  result: SolutionResults;
}

self.onmessage = ({ data }) => {
  const result = solve(data.start, data.end);
  self.postMessage({ start: data.start, end: data.end, result });
};
