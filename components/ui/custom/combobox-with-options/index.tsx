import { Combobox } from "../combobox";
import { useEffect } from "react";
export function ComboboxWithOptions({ 
    options, 
    value, 
    onChange, 
    disabled 
}: { options: { label: string, value: string }[], value: string, onChange: (value: string) => void, disabled?: boolean }) {
    useEffect(() => {
        console.log('options', options);
    }, [options]);
  return (
    <Combobox options={options} value={value} onChange={onChange} disabled={disabled}/>
  );
}
