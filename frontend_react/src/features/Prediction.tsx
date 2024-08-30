//"Black Box" function, not implemented yet.
//This block needs to get wallets history info and build Bitcoin predictions according
// to this info by AI.
//On this level we don't do implementation to this, so it creates random prediction.
import ReactSpeedometer, {
  CustomSegmentLabelPosition,
} from "react-d3-speedometer";
import React, { useEffect, useState } from "react";
import { useGetGetPredictionQuery } from "../redux/Api";
import { getSelectedTheme } from "../redux/PreferencesSlice";
import { useSelector } from "react-redux";

function getRandomNumber() {
  return Math.floor(Math.random() * 5);
}

const Prediction = () => {
  const isDarkMode = useSelector(getSelectedTheme);
  const { data, isFetching, refetch, isLoading } = useGetGetPredictionQuery();
  const [value, setValue] = useState(1000);
  const [prediction, setPrediction] = useState(data?.predictionForToday);

  const darkColors = {
    segment_one: "#818cf8",
    segment_two: "#6366F1",
    segment_three: "#3730A3",
    text: "#7c7c7c",
    needle: "#bdbdbd",
    key: "darkPrediction",
  };
  const whiteColors = {
    segment_one: "#370D67",
    segment_two: "#9059CF",
    segment_three: "#A179CF",
    text: "#424242",
    needle: "#424242",
    key: "whitePrediction",
  };

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
  if (isDarkMode) {
    return PredictionSpeedometer(
      value,
      prediction === undefined ? "Calculating..." : "Prediction",
      darkColors
    );
  } else {
    return PredictionSpeedometer(
      value,
      prediction === undefined ? "Calculating..." : "Prediction",
      whiteColors
    );
  }
};

const PredictionSpeedometer = (value: number, text: string, colors: any) => (
  <div key={colors.key} className="flex flex-col items-center px-8 mt-10 ">
    <ReactSpeedometer
      width={500}
      needleHeightRatio={0.7}
      value={value}
      customSegmentStops={[0, 250, 750, 1000]}
      segmentColors={[
        colors.segment_one,
        colors.segment_two,
        colors.segment_three,
      ]}
      currentValueText={text}
      customSegmentLabels={[
        {
          text: "Sell",
          position: "OUTSIDE" as CustomSegmentLabelPosition,
          color: colors.text,
        },
        {
          text: "Hold",
          position: "OUTSIDE" as CustomSegmentLabelPosition,
          color: colors.text,
        },
        {
          text: "Buy",
          position: "OUTSIDE" as CustomSegmentLabelPosition,
          color: colors.text,
        },
      ]}
      ringWidth={47}
      needleTransitionDuration={2500}
      // needleTransition="easeElastic"
      needleColor={colors.needle}
      textColor={colors.text}
    />
  </div>
);

export default Prediction;
