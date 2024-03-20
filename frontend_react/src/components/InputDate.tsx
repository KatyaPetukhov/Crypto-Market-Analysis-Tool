import React, { useState } from "react";
interface InputDateProps {
  setDate: (date?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const InputDate: React.FC<InputDateProps> = (props) => {
  const [value, setValue] = useState<string>("");
  const onBlur = (dateString: string) => {
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
    if (date == undefined) {
      setValue("");
    } else {
      setValue(date.toISOString().split("T")[0]);
      props.setDate(date);
    }
  };

  return (
    <input
      className="h-10 px-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 "
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
