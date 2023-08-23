import { average, slidingAverage } from ".";

describe("slidingAverage", () => {
  test("Empty array with window size of 1", function () {
    expect(slidingAverage([], 1)).toEqual([]);
  });

  test("Empty array with window size of 2", function () {
    expect(slidingAverage([], 2)).toEqual([]);
  });

  test("Array of 1 element with a window size of 1", function () {
    expect(slidingAverage([1], 1)).toEqual([1]);
  });

  test("Array of 3 elements with a window size of 1", function () {
    expect(slidingAverage([1, 2, 3], 1)).toEqual([1, 2, 3]);
  });

  test("Array of 1 element with a window size of 2", function () {
    expect(slidingAverage([1, 2, 3], 2)).toEqual([1, 1.5, 2.5]);
  });

  test("Array of 5 numbers, window of 3", function () {
    expect(slidingAverage([1, 2, 3, 4, 5], 3)).toEqual([1, 1.5, 2, 3, 4]);
  });
});

describe("average", () => {
  test("array with 1 element", () => {
    // WHEN
    const actual = average([1]);

    // THEN
    const expected: number = 1;
    expect(actual).toEqual(expected);
  });

  test("array with multiple elements", () => {
    // WHEN
    const actual = average([1, 2, 3, 4]);

    // THEN
    const expected: number = 2.5;
    expect(actual).toEqual(expected);
  });
});
