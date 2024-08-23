import { log } from "console";
import { executeAlgorithm } from "./genetic";
import { parentPort } from "worker_threads";

async function getPrediction() {
  let prediction = await executeAlgorithm();
  parentPort?.postMessage(prediction);
}
getPrediction();
