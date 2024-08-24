//"Black Box" function, not implemented yet.
//This block needs to get wallets history info and build Bitcoin predictions according
// to this info by AI.
//On this level we don't do implementation to this, so it creates random prediction.
import ReactSpeedometer, {
  CustomSegmentLabelPosition,
} from "react-d3-speedometer";
import React, { useEffect, useState } from "react";
import { useGetGetPredictionQuery } from "../redux/Api";

function getRandomNumber() {
  return Math.floor(Math.random() * 5);
}

const Prediction = () => {
  const { data, isFetching, refetch, isLoading } = useGetGetPredictionQuery();
  const [value, setValue] = useState(1000);
  const [prediction, setPrediction] = useState(data?.predictionForToday);
  useEffect(() => {
    setPrediction(data?.predictionForToday);
    if (prediction === undefined) {
      setTimeout(() => {
        setValue(Math.abs(1000 - value));
        if (!isLoading) {
          refetch();
        }
      }, 3000);
    } else {
      setValue(prediction === -1 ? 125 : prediction === 1 ? 875 : 500);
    }
  }, [data?.predictionForToday, prediction, value, isLoading, refetch]);

  return PredictionSpeedometer(
    value,
    prediction === undefined ? "Calculating..." : "Prediction"
  );
};

const PredictionSpeedometer = (value: number, text: string) => (
  <div className="flex flex-col items-center px-8 mt-10 ">
    <ReactSpeedometer
      width={500}
      needleHeightRatio={0.7}
      value={value}
      customSegmentStops={[0, 250, 750, 1000]}
      segmentColors={["#370D67", "#9059CF", "#A179CF"]}
      currentValueText={text}
      customSegmentLabels={[
        {
          text: "Sell",
          position: "OUTSIDE" as CustomSegmentLabelPosition,
          color: "#424242",
        },
        {
          text: "Hold",
          position: "OUTSIDE" as CustomSegmentLabelPosition,
          color: "#424242",
        },
        {
          text: "Buy",
          position: "OUTSIDE" as CustomSegmentLabelPosition,
          color: "#424242",
        },
      ]}
      ringWidth={47}
      needleTransitionDuration={2500}
      // needleTransition="easeElastic"
      needleColor={"black"}
      textColor={"#424242"}
    />
  </div>
);

export default Prediction;
