import { assert } from "chai";
import {
  preprocessWallets,
  preprocessBitcoinHistory,
  fitnessFunction,
  executeAlgorithm,
  testingDays,
  predictionForToday,
} from "../genetic";
// REMEMBER TO CHANGE THE NUMBER OF TESTING DAYS AND TESTING MODE IS TRUE IN GENETIC!!!!!!

describe("Prediction test increase and buy", () => {
  it("should return 1 when the price increases and the wallet buy everytime", async () => {
    const result = await executeAlgorithm(
      "./test/testing_wallet_buy",
      "./test/testing_history/price_increases.csv"
    );
    // console.log("1. PREDICTION IS " + result);

    assert.equal(result, 1);
  });
});

describe("Prediction test decreases and sell", () => {
  it("should return -1 when the price decreases and the wallet sell everytime", async () => {
    const result = await executeAlgorithm(
      "./test/testing_wallet_sell",
      "./test/testing_history/price_decreases.csv"
    );
    // console.log("2. PREDICTION IS " + result);
    assert.equal(result, -1);
  });
});

describe("Prediction test increase and sell", () => {
  it("should return 0 when the price increases and the wallet sell everytime", async () => {
    const result = await executeAlgorithm(
      "./test/testing_wallet_sell",
      "./test/testing_history/price_increases.csv"
    );

    assert.equal(result, 0);
  });
});

describe("Prediction test decreases and buy", () => {
  it("should return 0 when the price decreases and the wallet buy everytime", async () => {
    const result = await executeAlgorithm(
      "./test/testing_wallet_buy",
      "./test/testing_history/price_decreases.csv"
    );

    assert.equal(result, 0);
  });
});
