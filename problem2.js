const fs = require('node:fs');

function readInputFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8').split('\n').map(line => line.trim());
  const goodies = [];
  let numberOfEmployees = 0;
  
  for (const line of data) {
    if (line.startsWith('Number of employees')) {
      numberOfEmployees = Number.parseInt(line.split(':')[1].trim());
    } else if (line.includes(':')) {
      const [name, price] = line.split(':');
      goodies.push({ name: name.trim(), price: Number.parseInt(price.trim()) });
    }
  }

  return { goodies, numberOfEmployees };
}

function findGoodiesDistribution(goodies, numberOfEmployees) {
  goodies.sort((a, b) => a.price - b.price);

  let minDifference = Number.POSITIVE_INFINITY;
  let selectedGoodies = [];

  for (let i = 0; i <= goodies.length - numberOfEmployees; i++) {
    const currentSet = goodies.slice(i, i + numberOfEmployees);
    const difference = currentSet[currentSet.length - 1].price - currentSet[0].price;

    if (difference < minDifference) {
      minDifference = difference;
      selectedGoodies = currentSet;
    }
  }

  return { selectedGoodies, minDifference };
}

function writeOutputFile(filePath, selectedGoodies, minDifference) {
  let output = 'Here the goodies that are selected for distribution are:\n\n';
  
  for (const goodie of selectedGoodies) {
    output += `${goodie.name}: ${goodie.price}\n`;
  }
  
  output += `\nAnd the difference between the chosen goodie with highest price and the lowest price is ${minDifference}\n`;

  fs.writeFileSync(filePath, output, 'utf-8');
}

function main() {
  const inputFilePath = 'sample_input3.txt';
  const outputFilePath = 'sample_output3.txt';

  const { goodies, numberOfEmployees } = readInputFile(inputFilePath);
  const { selectedGoodies, minDifference } = findGoodiesDistribution(goodies, numberOfEmployees);
  writeOutputFile(outputFilePath, selectedGoodies, minDifference);

  console.log('Result recorded in sample_output3.txt');
}

main();
