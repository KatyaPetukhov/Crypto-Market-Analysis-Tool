import { executeAlgorithm } from "./genetic";
import { parentPort } from "worker_threads";

//Execute the algorithm and return the prediction to the main thread.

async function getPrediction() {
  let prediction = await executeAlgorithm();
  parentPort?.postMessage(prediction);
}
getPrediction();
