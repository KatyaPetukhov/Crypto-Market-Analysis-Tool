const GeneticAlgorithmConstructor = require("geneticalgorithm");
import { crawlBitcoinHistory, readBitcoinHistory } from "./crawlBitcoinHistory";
import { BitcoinHistory, Event, WalletData } from "./types";
import { createBitcoinWallets } from "./getWalletData";
import { log } from "console";
const random = require("random");
let allWallets: Map<string, number> = new Map();
let bitcoinHistory: Map<string, number> = new Map();
let minDate = new Date();
const testDays = 50;
const populationSize = 100;
let mutationCount = Math.floor(populationSize * 0.2);
let numOfEvolutions = 20;
let predictionForToday: number | undefined = undefined;

const clamp = (val: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, val));

//Probability that a mutation will happen
const completelyRandomMutationChance = 0.5;

interface Phenotype {
  daysBefore: number;
  daysAfter: number;
  bitcoinThreshold: number;
  percentThreshold: number;
}

const minimum: Phenotype = {
  daysBefore: 1,
  daysAfter: 1,
  bitcoinThreshold: 50,
  percentThreshold: 0.01,
};

const maximum: Phenotype = {
  daysBefore: 3,
  daysAfter: 3,
  bitcoinThreshold: 500,
  percentThreshold: 0.05,
};

//Probability that each variable will change if the mutation happens
const mutateProbablity = {
  daysBeforeProbablity: 0.5,
  daysAfterProbablity: 0.5,
  bitcionThresholdProbablity: 0.5,
  percentThresholdProbablity: 0.5,
};

//How much a variable can change from a mutation
const mutateRange = {
  daysBeforeRange: 5,
  daysAfterRange: 3,
  bitcionThresholdRange: 0.25,
  percentThresholdRange: 0.25,
};
const population: Phenotype[] = repeatFunction(populationSize);

const config = {
  mutationFunction: mutationFunction,
  crossoverFunction: crossoverFunction,
  fitnessFunction: fitnessFunction,
  doesABeatBFunction: doesABeatBFunction,
  population: population,
  populationSize: populationSize, // defaults to 100
};

const geneticalgorithm = GeneticAlgorithmConstructor(config);

async function executeAlgorithm(walletDir?: string, historyFile?: string) {
  if (walletDir) {
    preprocessWallets(createBitcoinWallets(walletDir));
  } else {
    preprocessWallets(createBitcoinWallets());
  }

  await preprocessBitcoinHistory(minDate, historyFile);
  geneticalgorithm.evolve();
  let best = geneticalgorithm.bestScore();
  let bestP = geneticalgorithm.best();
  while (best < 0.6 && numOfEvolutions > 0) {
    geneticalgorithm.evolve();
    bestP = geneticalgorithm.best();
    best = geneticalgorithm.bestScore();
    console.log(numOfEvolutions + " Best score: " + best);
    console.log(
      "Best Days Before: " +
        bestP.daysBefore +
        " Days After: " +
        bestP.daysAfter +
        " Bitcoin: " +
        bestP.bitcoinThreshold +
        " Percent: " +
        bestP.percentThreshold
    );
    numOfEvolutions--;
  }
  console.log("AFTER TESTING THE SCORE IS: " + testingDays(bestP));

  predictionForToday = createPrediction(bestP);
  return predictionForToday;
}

function createPrediction(phenotype: Phenotype) {
  //-1 to sell 0 to hold 1 to buy
  let countBitcoin = 0;
  let currentDate = new Date();
  let startCountDay = new Date();
  startCountDay.setDate(startCountDay.getDate() - phenotype.daysBefore);
  for (let i = startCountDay; i < currentDate; i.setDate(i.getDate() + 1)) {
    countBitcoin += allWallets.get(fromDateToString(i)) || 0;
  }

  if (Math.abs(countBitcoin) > phenotype.bitcoinThreshold) {
    return Math.sign(countBitcoin);
  }
  return 0;
}

function createRandomPhenotype() {
  const phenotype: Phenotype = {
    daysBefore: random.int(minimum.daysBefore, maximum.daysBefore),
    daysAfter: random.int(minimum.daysAfter, maximum.daysAfter),
    bitcoinThreshold: random.int(
      minimum.bitcoinThreshold,
      maximum.bitcoinThreshold
    ),
    percentThreshold: random.float(
      minimum.percentThreshold,
      maximum.percentThreshold
    ),
  };
  return phenotype;
}

function repeatFunction(count: number) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(createRandomPhenotype());
  }
  return result;
}

function randomNumFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomNumInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function mutationFunction(oldPhenotype: Phenotype) {
  // to create random func that says if of the mutation is completely random or based on probability plus last value

  let resultPhenotype: Phenotype = {
    daysAfter: oldPhenotype.daysAfter,
    daysBefore: oldPhenotype.daysBefore,
    bitcoinThreshold: oldPhenotype.bitcoinThreshold,
    percentThreshold: oldPhenotype.percentThreshold,
  };

  if (mutationCount > 0) {
    let randomGene = random.int(1, 4);
    switch (randomGene) {
      case 1: {
        resultPhenotype.daysAfter = random.int(
          minimum.daysAfter,
          maximum.daysAfter
        );
        break;
      }
      case 2: {
        resultPhenotype.daysBefore = random.int(
          minimum.daysBefore,
          maximum.daysBefore
        );
        break;
      }
      case 3: {
        resultPhenotype.bitcoinThreshold = random.int(
          minimum.bitcoinThreshold,
          maximum.bitcoinThreshold
        );
        break;
      }
      case 4: {
        resultPhenotype.percentThreshold = random.float(
          minimum.percentThreshold,
          maximum.percentThreshold
        );
        break;
      }

      default:
        break;
    }

    mutationCount--;
  }
  // if (Math.random() > completelyRandomMutationChance) {
  //   if (Math.random() < mutateProbablity.daysAfterProbablity) {
  //     resultPhenotype.daysAfter = clamp(
  //       randomNumInt(
  //         oldPhenotype.daysAfter - mutateRange.daysAfterRange,
  //         oldPhenotype.daysAfter + mutateRange.daysAfterRange
  //       ),
  //       minimum.daysAfter,
  //       maximum.daysAfter
  //     );
  //   }
  //   if (Math.random() < mutateProbablity.daysBeforeProbablity) {
  //     resultPhenotype.daysBefore = clamp(
  //       randomNumInt(
  //         oldPhenotype.daysBefore - mutateRange.daysBeforeRange,
  //         oldPhenotype.daysBefore + mutateRange.daysBeforeRange
  //       ),
  //       minimum.daysBefore,
  //       maximum.daysBefore
  //     );
  //   }
  //   if (Math.random() < mutateProbablity.bitcionThresholdProbablity) {
  //     resultPhenotype.bitcoinThreshold = clamp(
  //       randomNumFloat(
  //         oldPhenotype.bitcoinThreshold - (oldPhenotype.bitcoinThreshold * mutateRange.bitcionThresholdRange) ,
  //         oldPhenotype.bitcoinThreshold + (mutateRange.bitcionThresholdRange * oldPhenotype.bitcoinThreshold)
  //       ),
  //       minimum.bitcoinThreshold,
  //       maximum.bitcoinThreshold
  //     );
  //   }
  //   if (Math.random() < mutateProbablity.percentThresholdProbablity) {
  //     resultPhenotype.percentThreshold = clamp(
  //       randomNumFloat(
  //         oldPhenotype.percentThreshold - (oldPhenotype.percentThreshold * mutateRange.percentThresholdRange),
  //         oldPhenotype.percentThreshold +(oldPhenotype.percentThreshold * mutateRange.percentThresholdRange)
  //       ),
  //       minimum.percentThreshold,
  //       maximum.percentThreshold
  //     );
  //   }
  // } else {
  //   if (Math.random() < mutateProbablity.daysAfterProbablity) {
  //     resultPhenotype.daysAfter = randomNumInt(
  //       minimum.daysAfter,
  //       maximum.daysAfter
  //     );
  //   }
  //   if (Math.random() < mutateProbablity.daysBeforeProbablity) {
  //     resultPhenotype.daysBefore = randomNumInt(
  //       minimum.daysBefore,
  //       maximum.daysBefore
  //     );
  //   }
  //   if (Math.random() < mutateProbablity.bitcionThresholdProbablity) {
  //     resultPhenotype.bitcoinThreshold = randomNumFloat(
  //       minimum.bitcoinThreshold,
  //       maximum.bitcoinThreshold
  //     );
  //   }
  //   if (Math.random() < mutateProbablity.percentThresholdProbablity) {
  //     resultPhenotype.percentThreshold = randomNumFloat(
  //       minimum.percentThreshold,
  //       maximum.percentThreshold
  //     );
  //   }
  // }

  return resultPhenotype;
}

function crossoverFunction(phenoTypeA: Phenotype, phenoTypeB: Phenotype) {
  let child1: Phenotype = {
    daysBefore: random.boolean()
      ? phenoTypeA.daysBefore
      : phenoTypeB.daysBefore,
    daysAfter: random.boolean() ? phenoTypeA.daysAfter : phenoTypeB.daysAfter,
    bitcoinThreshold: random.boolean()
      ? phenoTypeA.bitcoinThreshold
      : phenoTypeB.bitcoinThreshold,
    percentThreshold: random.boolean()
      ? phenoTypeA.percentThreshold
      : phenoTypeB.percentThreshold,
  };
  let child2: Phenotype = {
    daysBefore: random.boolean()
      ? phenoTypeA.daysBefore
      : phenoTypeB.daysBefore,
    daysAfter: random.boolean() ? phenoTypeA.daysAfter : phenoTypeB.daysAfter,
    bitcoinThreshold: random.boolean()
      ? phenoTypeA.bitcoinThreshold
      : phenoTypeB.bitcoinThreshold,
    percentThreshold: random.boolean()
      ? phenoTypeA.percentThreshold
      : phenoTypeB.percentThreshold,
  };
  return [child1, child2];
}

function fitnessFunction(phenotype: Phenotype) {
  let currentDate = new Date(minDate);
  let maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - testDays);
  currentDate.setDate(minDate.getDate() + phenotype.daysBefore);
  // use phenotype and possibly some other information
  // to determine the fitness number.  Higher is better, lower is worse.
  return fitness(phenotype, currentDate, maxDate);
}

function fitness(phenotype: Phenotype, currentDate: Date, maxDate: Date) {
  let fitness = 0;
  let eventMap = new Map<string, Event>();

  for (let i = currentDate; i < maxDate; i.setDate(i.getDate() + 1)) {
    checkDay(phenotype, i, eventMap);
  }

  const totalEvents = eventMap.size;
  if (totalEvents === 0) {
    fitness = 0;
    return fitness;
  }
  let succesfulEvents = 0;
  eventMap.forEach((event, day) => {
    if (event.isSuccesfulEvent(phenotype.percentThreshold)) {
      succesfulEvents++;
    }
  });
  fitness = succesfulEvents / totalEvents;

  return fitness;
}

function checkDay(
  phenotype: Phenotype,
  day: Date,
  eventMap: Map<string, Event>
) {
  let startDay = new Date(day);
  startDay.setDate(day.getDate() - phenotype.daysBefore);
  let countBitcoin = 0;
  for (let i = startDay; i <= day; i.setDate(i.getDate() + 1)) {
    countBitcoin += allWallets.get(fromDateToString(i)) || 0;
  }

  if (Math.abs(countBitcoin) > phenotype.bitcoinThreshold) {
    const percentDay = new Date(day);
    percentDay.setDate(day.getDate() + phenotype.daysAfter);
    const priceThisDay = bitcoinHistory.get(fromDateToString(day));
    const priceAfter = bitcoinHistory.get(fromDateToString(percentDay));

    if (priceThisDay === undefined || priceAfter === undefined) {
      throw new Error("Undefined percent.");
    }

    const percent = priceAfter / priceThisDay;
    const event = new Event(countBitcoin, percent);

    eventMap.set(fromDateToString(day), event);
  }
}

function preprocessWallets(wallets: WalletData[]) {
  const transactionsByDate = new Map<string, number>();
  minDate = new Date();
  wallets.forEach((wallet) => {
    wallet.data.forEach((transaction) => {
      if (transaction.time < minDate) {
        minDate = transaction.time;
      }
      const thedate = fromDateToString(transaction.time);
      const amountToAdd = fromStringToNum(
        transaction.amount.split(" ")[0].replace(",", "")
      );

      if (transactionsByDate.has(thedate)) {
        let amount = transactionsByDate.get(thedate) || 0;
        amount += amountToAdd;
        transactionsByDate.set(thedate, amount);
      } else {
        transactionsByDate.set(thedate, amountToAdd);
      }
    });
  });
  allWallets = transactionsByDate;
  return transactionsByDate;
}

async function preprocessBitcoinHistory(from: Date, fileName?: string) {
  const fromDate = Math.floor(from.getTime() / 1000);
  let history;
  if (fileName) {
    history = readBitcoinHistory(fileName);
  } else {
    history = await crawlBitcoinHistory(fromDate, undefined, true);
  }

  bitcoinHistory = new Map<string, number>();
  history.forEach((day) => {
    bitcoinHistory.set(day.Date, fromStringToNum(day.Close));
    // console.log("Key " + day.Date + " Value " + fromStringToNum(day.Close));
  });
}

function fromDateToString(date: Date) {
  try {
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.log(error);
    return "";
  }
}

function fromStringToDate(date: string) {
  return new Date(date);
}

function fromStringToNum(amount: string) {
  const num: number = +amount;
  return num;
}

function doesABeatBFunction(phenoTypeA: Phenotype, phenoTypeB: Phenotype) {
  return fitnessFunction(phenoTypeA) >= fitnessFunction(phenoTypeB);
}

function testingDays(phenotype: Phenotype) {
  let currentDate = new Date();
  let maxDate = new Date();
  currentDate.setDate(currentDate.getDate() - testDays);
  maxDate.setDate(maxDate.getDate() - phenotype.daysAfter);
  return fitness(phenotype, currentDate, maxDate);
}

export {
  preprocessWallets,
  preprocessBitcoinHistory,
  fitnessFunction,
  executeAlgorithm,
  testingDays,
  predictionForToday,
};
