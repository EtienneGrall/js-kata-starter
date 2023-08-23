export const average = (array: number[]): number => {
  const sumOfAllEments = array.reduce((sum, currentElement) => sum + currentElement, 0);

  return sumOfAllEments / array.length;
};

export const slidingAverageV0 = (array: number[], windowSize: number): number[] => {
  return array.map((_, index) => {
    const windowStartIndex = Math.max(index - windowSize + 1, 0);
    const window = array.slice(windowStartIndex, index + 1);

    return average(window);
  });
};

export const slidingAverage = (array: number[], windowSize: number): number[] => {
  return array.reduce(
    ({ currentSum, result }, element, index) => {
      const elementToSubstract = index >= windowSize ? array[index - windowSize] : 0;
      const updatedSum = currentSum + element - elementToSubstract;

      return {
        currentSum: updatedSum,
        result: [...result, updatedSum / Math.min(windowSize, index + 1)],
      };
    },
    { currentSum: 0, result: [] }
  ).result;
};
