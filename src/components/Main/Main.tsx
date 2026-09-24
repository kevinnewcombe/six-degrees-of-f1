import './main.css';
import { useState, useEffect, useRef } from 'react';
import type { WorkerResults } from '../../utils/solve.worker';
import type { Driver, SolutionResults } from "@shared-types/app";
import Input from '../Input/Input';
import Solution from '../Solution/Solution';
import Spinner from '../Spinner/Spinner';

export default function Main({ drivers }: {
  drivers: Driver[];
}) {
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [results, setResults] = useState<SolutionResults>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const workerRef = useRef<Worker>(null);


  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.terminate(); // kill any in-progress calls
    }
    workerRef.current = new Worker(
      new URL("../../utils/solve.worker", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (e: MessageEvent<WorkerResults>) => {
      setResults(e.data.result);
      setIsPending(false);
    };

    if (workerRef.current && start != '' && end !== '') {
      setIsPending(true);
      workerRef.current.postMessage({ start, end });
    }
  }, [start, end]);

  const updateDrivers = (key: string, driverName: string) => {
    if (drivers.some((d) => d[0] == driverName)) {
      if (key == 'start') {
        setStart(driverName);
      } else if (key == 'end') {
        setEnd(driverName);
      }
    }
  }

  const fieldsAreValid = (start != end || start == '' || end == '');

  return (
    <main>
      <form className="selectform">
        <Input selectId={'start'} isValid={fieldsAreValid} defaultValue={start} onUpdate={updateDrivers} />
        <Input selectId={'end'} isValid={fieldsAreValid} defaultValue={end} onUpdate={updateDrivers} />
        <datalist id="nameslist">
          {drivers.map(driver => <option key={`nameslist-${driver[0]}`}>{driver[0]}</option>)}
        </datalist>
      </form>
      <div aria-live="polite">
        {isPending ? <Spinner /> : results && <Solution results={results} />}
      </div>
    </main>
  );
}