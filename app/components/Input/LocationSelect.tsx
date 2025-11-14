import React, { type SetStateAction } from "react";
import { MagnifyIcon } from "../Icons/MagnifyIcon";

interface Option {
  id: string;
  name: string;
  [key: string]: any;
}

interface LocationSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  excludeId?: string;
  icon?: React.ElementType;
  name: string;
  setShowMain: React.Dispatch<SetStateAction<boolean>>;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  label,
  value,
  onChange,
  options = [], // <-- default to empty array
  excludeId,
  icon: Icon,
  name,
  setShowMain,
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
          <div className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowMain(false)}>
            <MagnifyIcon className="w-5 h-5" />
          </div>
        </>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-100`}
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {options
            .filter((opt) => opt.id !== excludeId)
            .map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};


export default LocationSelect;
