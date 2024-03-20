import React from "react";
interface SelectProps {
  options: string[];
  setSelectedOption: (index: number) => void;
}

const Select: React.FC<SelectProps> = (props) => {
  return (
    <select
      className=" mt-3 mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-5"
      onChange={(e) => {
        const i = parseInt(e.currentTarget.value);
        props.setSelectedOption(i);
      }}
    >
      {props.options.map((option, i) => (
        <option key={i} value={i}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
