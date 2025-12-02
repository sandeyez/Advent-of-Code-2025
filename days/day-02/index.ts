function part1(input: string[]) {
  const line = input.join("");

  const ids = line.split(",").map<[string, string]>((range) => {
    const [first, second] = range.split("-");

    return [first, second];
  });

  return ids.reduce((acc, [start, end]) => {
    const startChars = start.padStart(end.length, "0").split("");
    const endChars = end.split("");

    const minFirstHalf = Number(
      startChars.slice(0, Math.ceil(startChars.length / 2)).join("")
    );
    const maxFirstHalf = Number(
      endChars.slice(0, Math.ceil(endChars.length / 2)).join("")
    );

    const availableFirstHalfs = new Array(maxFirstHalf - minFirstHalf + 1)
      .fill(0)
      .map((_, index) => (minFirstHalf + index).toString());

    const startNumber = Number(startChars.join(""));
    const endNumber = Number(endChars.join(""));

    const invalidIdSum = availableFirstHalfs.reduce((acc, firstHalf) => {
      const constructedID = Number(`${firstHalf}${firstHalf}`);

      if (constructedID >= startNumber && constructedID <= endNumber) {
        return acc + constructedID;
      }

      return acc;
    }, 0);

    return acc + invalidIdSum;
  }, 0);
}

function part2(input: string[]) {
  const line = input.join("");

  const ids = line.split(",").map<[string, string]>((range) => {
    const [first, second] = range.split("-");

    return [first, second];
  });

  return ids.reduce((acc, [start, end]) => {
    const startChars = start.padStart(end.length, "0").split("");
    const endChars = end.split("");

    const minFirstHalf = Number(
      startChars.slice(0, Math.ceil(startChars.length / 2)).join("")
    );
    const maxFirstHalf = Number(
      endChars.slice(0, Math.ceil(endChars.length / 2)).join("")
    );

    const availableFirstHalfs = [
      ...new Set(
        new Array(maxFirstHalf - minFirstHalf + 1)
          .fill(0)
          .map((_, index) => (minFirstHalf + index).toString())
          .flatMap((firstHalf) => {
            const maxLength = firstHalf.length;

            return new Array(maxLength)
              .fill(0)
              .map((_, index) => firstHalf.slice(0, index + 1));
          })
      ),
    ];

    const startNumber = Number(start);
    const endNumber = Number(end);

    const foundIds = new Set<number>();

    const invalidIdSum = availableFirstHalfs.reduce((acc, firstHalf) => {
      const minNumLength = start.length;
      const maxNumLength = end.length;

      const lengths = new Array(maxNumLength - minNumLength + 1)
        .fill(0)
        .map((_, index) => minNumLength + index);

      return (
        acc +
        lengths.reduce((acc, length) => {
          if (length % firstHalf.length !== 0) return acc;

          const constructedId = Number(
            firstHalf.repeat(length / firstHalf.length)
          );

          if (
            foundIds.has(constructedId) ||
            constructedId < startNumber ||
            constructedId > endNumber
          ) {
            return acc;
          }

          foundIds.add(constructedId);
          return acc + constructedId;
        }, 0)
      );
    }, 0);

    return acc + invalidIdSum;
  }, 0);
}

export default {
  part1,
  part2,
};
