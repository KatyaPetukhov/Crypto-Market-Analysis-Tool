const GeneticAlgorithmConstructor = require('geneticalgorithm')


interface Phenotype {
    daysBefore:number,
    daysAfter:number,
    bitcoinThreshold:number,
    percentThreshold:number,
}

const minimum:Phenotype = {
    daysBefore: 1,
    daysAfter: 1,
    bitcoinThreshold: 0.001,
    percentThreshold: 0.05,
}

const maximum:Phenotype = {
    daysBefore: 30,
    daysAfter: 10,
    bitcoinThreshold: 1,
    percentThreshold: 5,
}
const populationSize = 100;
const population:Phenotype[] = repeatFunction(populationSize);

const config = {
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    doesABeatBFunction: doesABeatBFunction,
    population:population,
    populationSize: populationSize 	// defaults to 100
}


const geneticalgorithm = GeneticAlgorithmConstructor( config )


function createRandomPhenotype(){
    const phenotype:Phenotype = {
        daysBefore: randomNumInt(minimum.daysBefore, maximum.daysBefore),
        daysAfter: randomNumInt(minimum.daysAfter,maximum.daysAfter),
        bitcoinThreshold: randomNumFloat(minimum.bitcoinThreshold, maximum.bitcoinThreshold),
        percentThreshold: randomNumFloat(minimum.percentThreshold, maximum.percentThreshold),
    }
    return phenotype;
}

function repeatFunction(count:number){
    const result = [];
    for(let i =0; i<count; i++){
        result.push(createRandomPhenotype());
    }
    return result;
}

function randomNumFloat(min:number, max:number){
    return Math.random() * (max - min) + min;
}

function randomNumInt(min:number, max:number){
    return Math.floor(Math.random() * (max - min) + min);
}


function mutationFunction (oldPhenotype:Phenotype) {
	let resultPhenotype = {}
	// use oldPhenotype and some random
	// function to make a change to your
	// phenotype
	return resultPhenotype
}

function crossoverFunction(phenoTypeA:Phenotype, phenoTypeB:Phenotype) {
	let child1:Phenotype = {
        daysBefore: Math.random() > 0.5 ? phenoTypeA.daysBefore : phenoTypeB.daysBefore,
        daysAfter: Math.random() > 0.5 ? phenoTypeA.daysAfter : phenoTypeB.daysAfter,
        bitcoinThreshold: Math.random() > 0.5 ? phenoTypeA.bitcoinThreshold : phenoTypeB.bitcoinThreshold,
        percentThreshold: Math.random() > 0.5 ? phenoTypeA.percentThreshold : phenoTypeB.percentThreshold,
    }
    let child2:Phenotype = {
        daysBefore: Math.random() > 0.5 ? phenoTypeA.daysBefore : phenoTypeB.daysBefore,
        daysAfter: Math.random() > 0.5 ? phenoTypeA.daysAfter : phenoTypeB.daysAfter,
        bitcoinThreshold: Math.random() > 0.5 ? phenoTypeA.bitcoinThreshold : phenoTypeB.bitcoinThreshold,
        percentThreshold: Math.random() > 0.5 ? phenoTypeA.percentThreshold : phenoTypeB.percentThreshold,
    }
    child1

	
	return [child1,child2]
}

function fitnessFunction(phenotype:Phenotype) {
	let fitness = 0
	// use phenotype and possibly some other information
	// to determine the fitness number.  Higher is better, lower is worse.
	return fitness;
}

function doesABeatBFunction(phenoTypeA:Phenotype, phenoTypeB:Phenotype) {
	return fitnessFunction(phenoTypeA) >= fitnessFunction(phenoTypeB)
}