import { assert } from "chai";
import {
  preprocessWallets,
  preprocessBitcoinHistory,
  fitnessFunction,
  executeAlgorithm,
  testingDays,
  predictionForToday,
} from "../genetic";
import { log } from "console";
// REMEMBER TO CHANGE THE NUMBER OF TESTING DAYS!!!!!!
describe("Prediction test increase and buy", () => {
  it("should return 1 when the price increases and the wallet buy everytime", async () => {
    const result = await executeAlgorithm(
      "./test/testing_wallet_buy",
      "./test/testing_history/price_increases.csv"
    );

    assert.equal(result, 1);
  });
});

describe("Prediction test decreases and sell", () => {
  it("should return -1 when the price decreases and the wallet sell everytime", async () => {
    const result = await executeAlgorithm(
      "./test/testing_wallet_sell",
      "./test/testing_history/price_decreases.csv"
    );

    assert.equal(result, -1);
  });
});
