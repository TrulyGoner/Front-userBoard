import type { SelectHTMLAttributes } from 'react';
import './Select.scss';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = ({ label, options, error, className = '', ...props }: SelectProps) => {
  return (
    <div className="select-wrapper">
      {label && <label className="select-label">{label}</label>}
      <select className={`select ${className} ${error ? 'select--error' : ''}`} {...props}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};
