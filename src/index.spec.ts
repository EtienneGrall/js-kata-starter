import { atm, countBillsInWithdrwal } from ".";

describe("atm", () => {
  it("should return no bill if amount is 0", () => {
    const actual = atm(0);

    const expected = {};

    expect(actual).toEqual(expected);
  });

  it("should return one bill of 1 if amount is 1", () => {
    const actual = atm(1);

    const expected = { 1: 1 };

    expect(actual).toEqual(expected);
  });

  it("should return one bill of 2 if amount is 1", () => {
    const actual = atm(2);

    const expected = { 2: 1 };

    expect(actual).toEqual(expected);
  });

  it("should return one bill of 2 and one of 1 if amount is 3", () => {
    const actual = atm(3);

    const expected = { 2: 1, 1: 1 };

    expect(actual).toEqual(expected);
  });

  it.skip("should return two bills of 20 if amount is 40", () => {
    const actual = atm(40);

    const expected = { 20: 2 };

    expect(actual).toEqual(expected);
  });
});

describe("Count the number of bills in a withdrawal", () => {
  test("0 if no bill", () => {
    // GIVEN
    const withdrawal = {};

    // WHEN
    const actual = countBillsInWithdrwal(withdrawal);

    // THEN
    const expected: number = 0;
    expect(actual).toEqual(expected);
  });

  test("3 with 3 bills of same amount", () => {
    // GIVEN
    const withdrawal = {
      1: 3,
    };

    // WHEN
    const actual = countBillsInWithdrwal(withdrawal);

    // THEN
    const expected: number = 3;
    expect(actual).toEqual(expected);
  });

  test("3 with 3 bills of same amount", () => {
    // GIVEN
    const withdrawal = {
      2: 3,
    };

    // WHEN
    const actual = countBillsInWithdrwal(withdrawal);

    // THEN
    const expected: number = 3;
    expect(actual).toEqual(expected);
  });

  test("6 with 3 bills of same amount + 2 of other amount and 1 of another amount", () => {
    // GIVEN
    const withdrawal = {
      2: 3,
      10: 2,
      25: 1,
    };

    // WHEN
    const actual = countBillsInWithdrwal(withdrawal);

    // THEN
    const expected: number = 6;
    expect(actual).toEqual(expected);
  });
});
