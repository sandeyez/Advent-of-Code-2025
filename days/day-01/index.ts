const INITIAL_VALUE = 50;
const MAX_VALUE = 100;

function mod(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

function part1(input: string[]) {
  let currentValue = INITIAL_VALUE;
  let zeroCount = 0;

  for (const line of input) {
    const isLeft = line.startsWith("L");
    const amount = Number(line.slice(1));

    if (isLeft) {
      currentValue = mod(currentValue - amount, MAX_VALUE);
    } else {
      currentValue = mod(currentValue + amount, MAX_VALUE);
    }

    if (currentValue === 0) {
      zeroCount++;
    }
  }

  return zeroCount;
}

function part2(input: string[]) {
  let currentValue = INITIAL_VALUE;
  let amountOfZeroes = 0;

  for (const line of input) {
    const isLeft = line.startsWith("L");
    const amount = Number(line.slice(1));

    const unmoddedNextValue = isLeft
      ? currentValue - mod(amount, MAX_VALUE)
      : currentValue + mod(amount, MAX_VALUE);

    const numberOfRotations = Math.floor(Math.abs(amount) / MAX_VALUE);
    const nextValue = mod(unmoddedNextValue, MAX_VALUE);

    amountOfZeroes += numberOfRotations;

    if (
      (currentValue !== 0 && unmoddedNextValue <= 0) ||
      unmoddedNextValue >= MAX_VALUE
    ) {
      amountOfZeroes++;
    }

    currentValue = mod(nextValue, MAX_VALUE);
  }

  return amountOfZeroes;
}

export default { part1, part2 };
