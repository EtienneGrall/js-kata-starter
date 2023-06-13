import findBestSolution from ".";

describe("Test of findBestSolution()", () => {
  test("Comparison only", () => {
    expect(
      findBestSolution<number, number>({
        map: (i) => i,
        compare: (i, j) => i - j,
      })([3, 1, 2, 0, 4])
    ).toEqual(0);
  });

  test("Mapping and comparison only", () => {
    expect(
      findBestSolution<number, number>({
        map: (i) => i + 10,
        compare: (i, j) => i - j,
      })([3, 1, 2, 0, 4])
    ).toEqual(10);
  });

  test("Mapping, comparison and acceleration", () => {
    expect(
      findBestSolution<number, number>({
        map: (i) => i + 10,
        compare: (i, j) => i - j,
        accelerate: (i) => i === 10,
      })([3, 1, 2, 0, 4])
    ).toEqual(10);
  });
});
