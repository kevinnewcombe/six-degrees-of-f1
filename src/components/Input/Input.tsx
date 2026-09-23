import './input.css';
export default function Input({ selectId, isValid, defaultValue, onUpdate }: {
  selectId: string,
  isValid: boolean,
  defaultValue?: string,
  onUpdate: (key: string, driverId: string) => void
}) {
  return <label>
    {selectId == 'start' ? "From" : "To"}<br />
    <input name={`driver-${selectId}`} type="text" defaultValue={defaultValue} list="nameslist" autoComplete="off" spellCheck="false" onChange={(e) => onUpdate(selectId, e.target.value.trim())} aria-invalid={!isValid} />
  </label>
}