import React, { useState } from "react";
import Button from "./Button";
import InputDate from "./InputDate";

const Chart = () => {
  const [fromDate, setFromDate] = useState<Date>();
  const [untilDate, setUntilDate] = useState<Date>();
  return (
    <main className="container mx-auto px-6 py-8 ">
      <section className="mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 my-6">
          Explore the Crypto World
        </h2>
        <div className="mx-auto flex flex-wrap items-end gap-6 mb-6">
          <div>
            From:
            <InputDate setDate={setFromDate} maxDate={untilDate} />
          </div>

          <div>
            Until:
            <InputDate setDate={setUntilDate} minDate={fromDate} />
          </div>
          <div>
            <Button
              name={"Update Data"}
              onClick={() => {
                alert("Clicked");
              }}
            ></Button>
          </div>
        </div>
        <div className="w-full">
          <svg
            id="loading"
            className="animate-spin h-10 w-1 text-gray-500 text-center invisible block mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 26 26"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#9b9b9b"
              stroke-width="3"
            ></circle>
            <clipPath id="cut-off-bottom">
              <rect x="0" y="0" width="12" height="12" />
            </clipPath>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#791bbd"
              stroke-width="3"
              clip-path="url(#cut-off-bottom)"
            ></circle>
          </svg>
        </div>

        <canvas id="chart"></canvas>
      </section>
    </main>
  );
};

export default Chart;
