const GeneticAlgorithmConstructor = require("geneticalgorithm");
import { crawlBitcoinHistory } from "./crawl";
import { getAllWallets } from "./database";
import { BitcoinHistory, WalletData } from "./types";
let allWallets: Map<string, number> = new Map();
let bitcoinHistory: Map<string, number> = new Map();
let minDate = new Date();
const testDays = 50;

const clamp = (val: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, val));

const completelyRandomMutationChance = 0.1;

interface Phenotype {
  daysBefore: number;
  daysAfter: number;
  bitcoinThreshold: number;
  percentThreshold: number;
}

const minimum: Phenotype = {
  daysBefore: 1,
  daysAfter: 1,
  bitcoinThreshold: 0.001,
  percentThreshold: 0.05,   
};

const maximum: Phenotype = {
  daysBefore: 30,
  daysAfter: 10,
  bitcoinThreshold: 1,
  percentThreshold: 5,
};

const mutateProbablity = {
  daysBeforeProbablity: 0.35,
  daysAfterProbablity: 0.35,
  bitcionThresholdProbablity: 0.1,
  percentThresholdProbablity: 0.2,
};

const mutateRange = {
  daysBeforeRange: 5,
  daysAfterRange: 3,
  bitcionThresholdRange: 0.00005,
  percentThresholdRange: 0.01,
};

const populationSize = 100;
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

function createRandomPhenotype() {
  const phenotype: Phenotype = {
    daysBefore: randomNumInt(minimum.daysBefore, maximum.daysBefore),
    daysAfter: randomNumInt(minimum.daysAfter, maximum.daysAfter),
    bitcoinThreshold: randomNumFloat(
      minimum.bitcoinThreshold,
      maximum.bitcoinThreshold
    ),
    percentThreshold: randomNumFloat(
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
  if (Math.random() > completelyRandomMutationChance) {
    if (Math.random() < mutateProbablity.daysAfterProbablity) {
      resultPhenotype.daysAfter = clamp(
        randomNumInt(
          oldPhenotype.daysAfter - mutateRange.daysAfterRange,
          oldPhenotype.daysAfter + mutateRange.daysAfterRange
        ),
        minimum.daysAfter,
        maximum.daysAfter
      );
    }
    if (Math.random() < mutateProbablity.daysBeforeProbablity) {
      resultPhenotype.daysBefore = clamp(
        randomNumInt(
          oldPhenotype.daysBefore - mutateRange.daysBeforeRange,
          oldPhenotype.daysBefore + mutateRange.daysBeforeRange
        ),
        minimum.daysBefore,
        maximum.daysBefore
      );
    }
    if (Math.random() < mutateProbablity.bitcionThresholdProbablity) {
      resultPhenotype.bitcoinThreshold = clamp(
        randomNumFloat(
          oldPhenotype.bitcoinThreshold - mutateRange.bitcionThresholdRange,
          oldPhenotype.bitcoinThreshold + mutateRange.bitcionThresholdRange
        ),
        minimum.bitcoinThreshold,
        maximum.bitcoinThreshold
      );
    }
    if (Math.random() < mutateProbablity.percentThresholdProbablity) {
      resultPhenotype.percentThreshold = clamp(
        randomNumFloat(
          oldPhenotype.percentThreshold - mutateRange.percentThresholdRange,
          oldPhenotype.percentThreshold + mutateRange.percentThresholdRange
        ),
        minimum.percentThreshold,
        maximum.percentThreshold
      );
    }
  } else {
    if (Math.random() < mutateProbablity.daysAfterProbablity) {
      resultPhenotype.daysAfter = randomNumInt(
        minimum.daysAfter,
        maximum.daysAfter
      );
    }
    if (Math.random() < mutateProbablity.daysBeforeProbablity) {
      resultPhenotype.daysBefore = randomNumInt(
        minimum.daysBefore,
        maximum.daysBefore
      );
    }
    if (Math.random() < mutateProbablity.bitcionThresholdProbablity) {
      resultPhenotype.bitcoinThreshold = randomNumFloat(
        minimum.bitcoinThreshold,
        maximum.bitcoinThreshold
      );
    }
    if (Math.random() < mutateProbablity.percentThresholdProbablity) {
      resultPhenotype.percentThreshold = randomNumFloat(
        minimum.percentThreshold,
        maximum.percentThreshold
      );
    }
  }


  return resultPhenotype;
}

function crossoverFunction(phenoTypeA: Phenotype, phenoTypeB: Phenotype) {
  let child1: Phenotype = {
    daysBefore:
      Math.random() > 0.5 ? phenoTypeA.daysBefore : phenoTypeB.daysBefore,
    daysAfter:
      Math.random() > 0.5 ? phenoTypeA.daysAfter : phenoTypeB.daysAfter,
    bitcoinThreshold:
      Math.random() > 0.5
        ? phenoTypeA.bitcoinThreshold
        : phenoTypeB.bitcoinThreshold,
    percentThreshold:
      Math.random() > 0.5
        ? phenoTypeA.percentThreshold
        : phenoTypeB.percentThreshold,
  };
  let child2: Phenotype = {
    daysBefore:
      Math.random() > 0.5 ? phenoTypeA.daysBefore : phenoTypeB.daysBefore,
    daysAfter:
      Math.random() > 0.5 ? phenoTypeA.daysAfter : phenoTypeB.daysAfter,
    bitcoinThreshold:
      Math.random() > 0.5
        ? phenoTypeA.bitcoinThreshold
        : phenoTypeB.bitcoinThreshold,
    percentThreshold:
      Math.random() > 0.5
        ? phenoTypeA.percentThreshold
        : phenoTypeB.percentThreshold,
  };
  return [child1, child2];
}

// TO DO LOOP over days before and calculate ...
function fitnessFunction(phenotype: Phenotype) {
  let fitness = 0;
  let currentDate = minDate;
  currentDate.setDate(minDate.getDate() + phenotype.daysBefore);   
  // use phenotype and possibly some other information
  // to determine the fitness number.  Higher is better, lower is worse.
  let eventMap = new Map<string, Event>();

  

  allWallets.forEach((amount, day) => {

  
  });


  return fitness;
}




// MAP Doesn't wotk with Date as key! TODO convert to srting and then to date? DONE
function preprocessWallers(wallets: WalletData[]){
    const transactionsByDate = new Map<string, number>();
    minDate = new Date();
    wallets.forEach(wallet => {
        wallet.data.forEach(transaction => {
            if(transaction.time < minDate){
              minDate = transaction.time;
            }
            const thedate = fromDateToString(transaction.time);
            const amountToAdd = fromStringToNum(transaction.amount.split(' ')[0].replace(',',''));

            if(transactionsByDate.has(thedate)){
                let amount = transactionsByDate.get(thedate) || 0;
                amount += amountToAdd;
                transactionsByDate.set(thedate, amount);
            }
            else{
                transactionsByDate.set(thedate, amountToAdd);
            }

        });
    });
    allWallets = transactionsByDate;
    return transactionsByDate;
}

async function preprocessBitcoinHistory(from: Date){
  const fromDate = Math.floor(from.getTime() / 1000);
  const history = await crawlBitcoinHistory(fromDate);
  bitcoinHistory = new Map<string, number>();
  history.forEach(day => {
    bitcoinHistory.set(day.Date, fromStringToNum(day.Close));
    // console.log("Key " + day.Date + " Value " + fromStringToNum(day.Close));
  });
}


function fromDateToString(date: Date){
  return date.toISOString().split('T')[0];
}

function fromStringToDate(date: string){
  return  new Date(date);
}

function fromStringToNum(amount: string){
    const num: number = +amount;
    return num;
}



function doesABeatBFunction(phenoTypeA: Phenotype, phenoTypeB: Phenotype) {
  return fitnessFunction(phenoTypeA) >= fitnessFunction(phenoTypeB);
}

export { preprocessWallers, preprocessBitcoinHistory };
//TODO
// get the sum from all the wallets for each day.