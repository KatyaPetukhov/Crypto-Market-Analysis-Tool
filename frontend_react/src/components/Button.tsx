import React from "react";
interface ButtonProps {
  name: string;
  onClick: () => void;
  disabled?: boolean;
  extraStyles?: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  const extraStyles = props.extraStyles || "";
  return (
    <button
      //   id="updateDatesBtn"
      disabled={props.disabled || false}
      className={
        "btn h-10 px-5 w-full bg-blue-500 hover:bg-blue-700 text-white block p-2 rounded-lg disabled:bg-slate-300 " +
        extraStyles
      }
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};

export default Button;
