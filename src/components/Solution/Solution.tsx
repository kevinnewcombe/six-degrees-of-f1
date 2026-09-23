import './solution.css';
import { solve } from '../../utils/solve';

const prettySeasons = (seasons: number[]) => {
  // Turn an array of years into something more human readable, like "2016-2019"
  if (seasons.length == 1) {
    return seasons[0];
  }

  const orderedSeasons = [...seasons].sort((a, b) => a - b);

  const groups: number[][] = [];
  for (let i = 0; i < orderedSeasons.length; i++) {
    const year = orderedSeasons[i];
    if (i == 0 || year - 1 != orderedSeasons[i - 1]) {
      groups.push([year]);
    } else {
      groups[groups.length - 1].push(year);
    }
  }

  const words: string[] = groups.map((g) => {
    if (g.length == 1) {
      return g[0].toString();
    }
    const start = g[0];
    const end = g[g.length - 1];
    return `${start}${end - start == 1 ? ', ' : '-'}${end}`;
  });
  return words.join(", ");
};

export default function Solution({ results }: {
  results: ReturnType<typeof solve>;
}) {
  if (results.error) {
    return <div className="solution"><h2 className="title error">{results.message}</h2></div>
  }

  const paths = results.paths;
  const noOfSteps = paths[0].length;

  return (
    <div className="solution">
      <h2 className="title">{paths[0][0].start} can be connected to {paths[0][paths[0].length - 1].end} in {noOfSteps} step{noOfSteps > 1 && 's'}.</h2>
      {
        paths.map((path, pathIndex) => {
          return (
            <div key={`solution-${pathIndex}`}>
              <ol>
                {path.map((pair, pairIndex) => {
                  const teams = pair.teams.map((t) => `${t.constructorName} (${prettySeasons(t.seasons)})`);
                  return <li key={`solution-pair-${pathIndex}-${pairIndex}`}>
                    <strong>{pair.start}</strong> to <strong>{pair.end}</strong> — {teams.join(' and ')} <br />
                  </li>
                })
                }
              </ol>
              {pathIndex < paths.length - 1 ? <span className="paths-divider">or</span> : ''}
            </div>
          )
        })
      }
    </div>
  )
}
