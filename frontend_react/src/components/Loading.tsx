import React from "react";
interface LoadingProps {
  isLoading?: boolean;
}

const Loading: React.FC<LoadingProps> = (props) => {
  return (
    <div className="w-full">
      <svg
        id="loading"
        className={`animate-spin h-10 w-10 text-gray-500 text-center block mx-auto ${
          !props.isLoading ? "invisible" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 26 26"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#9b9b9b"
          strokeWidth="3"
        ></circle>
        <clipPath id="cut-off-bottom">
          <rect x="0" y="0" width="12" height="12" />
        </clipPath>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#791bbd"
          strokeWidth="3"
          clipPath="url(#cut-off-bottom)"
        ></circle>
      </svg>
    </div>
  );
};

export default Loading;
