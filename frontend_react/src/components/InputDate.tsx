//  Returns an input date component that support minimum and maximum dates.
import React, { useState } from "react";
interface InputDateProps {
  setDate: (date?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const InputDate: React.FC<InputDateProps> = (props) => {
  const [value, setValue] = useState<string>("");

  //  Update the input state after the user finish modifying it if the input is valid.

  const onBlur = (dateString: string) => {
    if (dateString === "") return;
    let date = new Date(dateString);
    let minDate = new Date("2014-09-17");
    let now = new Date();
    let fromDate = props.minDate || minDate;
    let untilDate = props.maxDate || now;
    if (date < fromDate) {
      date = fromDate;
    } else if (date > untilDate) {
      date = untilDate;
    }
    if (date === undefined) {
      setValue("");
    } else {
      setValue(date.toISOString().split("T")[0]);
      props.setDate(date);
    }
  };

  return (
    <input
      className="h-10 px-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      // id="untilDateInput"
      type="date"
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onBlur={(event) => {
        onBlur(event.target.value);
      }}
      value={value}
    />
  );
};

export default InputDate;
