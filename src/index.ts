type WeakDigit = "I" | "X" | "C" | "M";

type StrongDigit = "V" | "L" | "D";

type OneTwoThreeOrFour<W extends WeakDigit> = `${W}` | `${W}${W}` | `${W}${W}${W}` | `${W}${W}${W}${W}`;
type OnlyOne<S extends StrongDigit> = `${S}`;

type WeakOnly<W extends WeakDigit> = { weaks: OneTwoThreeOrFour<W> };
type StrongOnly<S extends StrongDigit> = { strong: S };
type StrongAndWeak<W extends WeakDigit, S extends StrongDigit> = { weaks: OneTwoThreeOrFour<W>; strong: S };

type WeakAdditionResult<W extends WeakDigit, S extends StrongDigit> = WeakOnly<W> | StrongOnly<S> | StrongAndWeak<W, S>;

/* const repeatNTimes =
  <W extends WeakDigit>(n: 1 | 2 | 3 | 4) =>
  (digit: W): OneTwoThreeOrFour<W> => {
    switch (n) {
      case 1:
        return `${digit}`;
      case 2:
        return `${digit}${digit}`;
      case 3:
        return `${digit}${digit}${digit}`;
      case 4:
        return `${digit}${digit}${digit}${digit}`;
    }
  }; */

const weakAdditionTable = <W extends WeakDigit, S extends StrongDigit>(
  w: W,
  s: S
): Partial<Record<OneTwoThreeOrFour<W>, Partial<Record<OneTwoThreeOrFour<W>, WeakAdditionResult<W, S>>>>> => {
  // @ts-expect-error
  return {
    [`${w}`]: {
      [`${w}`]: { weaks: `${w}${w}` },
      [`${w}${w}`]: { weaks: `${w}${w}${w}` },
      [`${w}${w}${w}`]: { weaks: `${w}${w}${w}${w}` },
      [`${w}${w}${w}${w}`]: { strong: s },
    },
    [`${w}${w}`]: {
      [`${w}`]: { weaks: `${w}${w}${w}` },
      [`${w}${w}`]: { weaks: `${w}${w}${w}${w}` },
      [`${w}${w}${w}`]: { strong: s },
      [`${w}${w}${w}${w}`]: { strong: s, weaks: `${w}` },
    },
    [`${w}${w}${w}`]: {
      [`${w}`]: { weaks: `${w}${w}${w}${w}` },
      [`${w}${w}`]: { strong: s },
      [`${w}${w}${w}`]: { strong: s, weaks: `${w}` },
      [`${w}${w}${w}${w}`]: { strong: s, weaks: `${w}${w}` },
    },
    [`${w}${w}${w}${w}`]: {
      [`${w}`]: { strong: s },
      [`${w}${w}`]: { strong: s, weaks: `${w}` },
      [`${w}${w}${w}`]: { strong: s, weaks: `${w}${w}` },
      [`${w}${w}${w}${w}`]: { strong: s, weaks: `${w}${w}${w}` },
    },
  };
};

type StrongAdditionResult<S extends StrongDigit, W extends WeakDigit> = WeakOnly<W>;

const strongAdditionTable = <S extends StrongDigit, W extends WeakDigit>(
  s: S,
  w: W
): Partial<Record<OnlyOne<S>, Partial<Record<OnlyOne<S>, StrongAdditionResult<S, W>>>>> => {
  // @ts-expect-error
  return {
    [`${s}`]: {
      [`${s}`]: { weaks: `${w}` },
    },
  };
};

type StructuredRomanNumber = {
  [W in WeakDigit]?: OneTwoThreeOrFour<W>;
} & {
  [S in StrongDigit]?: OnlyOne<S>;
};

export type RomanNumber = `${StrongDigit | ""}${OneTwoThreeOrFour<WeakDigit> | ""}`;

const addVs = (a: StructuredRomanNumber, b: StructuredRomanNumber) => {
  // Both are defined
  if (a.V && b.V) {
    const strongTable = strongAdditionTable("V", "X");
    const VadditionResult = strongTable[a.V][b.V];

    return {
      X: `${VadditionResult.weaks}`,
      V: undefined,
    };
  }

  // Only one is defined
  if ((a.V && !b.V) || (b.V && !a.V)) {
    return { V: a.V ?? b.V };
  }

  return {};
};

export const add = (a: StructuredRomanNumber, b: StructuredRomanNumber): StructuredRomanNumber => {
  const weakTable = weakAdditionTable("I", "V");

  let result: StructuredRomanNumber = {};
  let deduction: StructuredRomanNumber = {};

  // Both are defined
  if (a.I && b.I) {
    const IadditionResult = weakTable[a.I][b.I];
    if (!("strong" in IadditionResult)) {
      result = { I: IadditionResult.weaks };
    }

    if (!("weaks" in IadditionResult)) {
      deduction = { V: IadditionResult.strong };
    }

    if ("weaks" in IadditionResult && "strong" in IadditionResult) {
      result = { I: IadditionResult.weaks };
      deduction = { V: IadditionResult.strong };
    }
  }

  // Only one is defined
  if ((a.I && !b.I) || (b.I && !a.I)) {
    result = { I: a.I ?? b.I };
  }

  console.log({ deduction, result });
  result = {
    ...result,
    ...addVs(a, b),
  };
  console.log({ result });

  result = {
    ...result,
    ...addVs({ V: result.V }, deduction),
  };
  console.log({ result });

  return result;
};
