type WeakDigit = "I" | "X" | "C" | "M";

type StrongDigit = "V" | "L" | "D";

type OneTwoThreeOrFour<W extends WeakDigit> = `${W}` | `${W}${W}` | `${W}${W}${W}` | `${W}${W}${W}${W}`;
type OnlyOne<S extends StrongDigit> = `${S}`;

type WeakOnly<W extends WeakDigit> = { weaks: OneTwoThreeOrFour<W> };
type StrongOnly<S extends StrongDigit> = { strong: S };
type StrongAndWeak<W extends WeakDigit, S extends StrongDigit> = { weaks: OneTwoThreeOrFour<W>; strong: S };

type WeakAdditionResult<W extends WeakDigit, S extends StrongDigit> = WeakOnly<W> | StrongOnly<S> | StrongAndWeak<W, S>;

type WeakToStrongTransition = {
  weak: WeakDigit;
  strong: StrongDigit;
  direction: "weakToStrong";
};
type StrongToWeakTransition = {
  weak: WeakDigit;
  strong: StrongDigit;
  direction: "strongToWeak";
};

type Transition = WeakToStrongTransition | StrongToWeakTransition;

const transitions: Array<Transition> = [
  {
    weak: "I",
    strong: "V",
    direction: "weakToStrong",
  },
  {
    weak: "X",
    strong: "V",
    direction: "strongToWeak",
  },
  {
    weak: "X",
    strong: "L",
    direction: "weakToStrong",
  },
  {
    weak: "C",
    strong: "L",
    direction: "strongToWeak",
  },
  {
    weak: "C",
    strong: "D",
    direction: "weakToStrong",
  },
];

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

const addStrongs = (transition: Transition) => (a: StructuredRomanNumber, b: StructuredRomanNumber) => {
  const weakDigit = transition.weak;
  const strongDigit = transition.strong;

  // Both are defined
  if (a[strongDigit] && b[strongDigit]) {
    const strongTable = strongAdditionTable(strongDigit, weakDigit);
    const additionResult = strongTable[a[strongDigit]][b[strongDigit]];

    return {
      [weakDigit]: `${additionResult.weaks}`,
      [strongDigit]: undefined,
    };
  }

  // Only one is defined
  if ((a[strongDigit] && !b[strongDigit]) || (b[strongDigit] && !a[strongDigit])) {
    return { [strongDigit]: a[strongDigit] ?? b[strongDigit] };
  }

  return {};
};

const addWeaks = (transition: Transition) => (a: StructuredRomanNumber, b: StructuredRomanNumber) => {
  const weakDigit = transition.weak;
  const strongDigit = transition.strong;

  // Both are defined
  if (a[weakDigit] && b[weakDigit]) {
    const weakTable = weakAdditionTable(weakDigit, strongDigit);

    const additionResult = weakTable[a[weakDigit]][b[weakDigit]];

    if (!("strong" in additionResult)) {
      return { result: { [weakDigit]: additionResult.weaks }, deduction: {} };
    }

    if (!("weaks" in additionResult)) {
      return { deduction: { [strongDigit]: additionResult.strong }, result: {} };
    }

    if ("weaks" in additionResult && "strong" in additionResult) {
      return { result: { [weakDigit]: additionResult.weaks }, deduction: { [strongDigit]: additionResult.strong } };
    }
  }

  // Only one is defined
  if ((a[weakDigit] && !b[weakDigit]) || (b[weakDigit] && !a[weakDigit])) {
    return { result: { [weakDigit]: a[weakDigit] ?? b[weakDigit] }, deduction: {} };
  }

  return { result: {}, deduction: {} };
};

export const add = (a: StructuredRomanNumber, b: StructuredRomanNumber): StructuredRomanNumber => {
  let initialResult: StructuredRomanNumber = {};
  let initialDeduction: StructuredRomanNumber = {};

  const finalResult = transitions.reduce(
    (accumulator, transition) => {
      const weakDigit = transition.weak;
      const strongDigit = transition.strong;
      let resultForThisIterration: StructuredRomanNumber = {};
      let deductionForThisIterration: StructuredRomanNumber = {};
      if (transition.direction === "weakToStrong") {
        const { result, deduction } = addWeaks(transition)(a, b);
        const resultForThisIterrationWithoutDeduction = {
          ...accumulator.result,
          ...result,
        };

        resultForThisIterration = {
          ...resultForThisIterrationWithoutDeduction,
          ...addWeaks(transition)(resultForThisIterrationWithoutDeduction, accumulator.deduction).result,
        };

        deductionForThisIterration = deduction;
      }

      if (transition.direction === "strongToWeak") {
        const resultForThisIterrationWithoutDeduction = {
          ...accumulator.result,
          ...addStrongs(transition)(a, b),
        };

        resultForThisIterration = {
          ...resultForThisIterrationWithoutDeduction,
          ...addStrongs(transition)(
            { [strongDigit]: resultForThisIterrationWithoutDeduction[strongDigit] },
            accumulator.deduction
          ),
        };
      }

      return {
        result: resultForThisIterration,
        deduction: deductionForThisIterration,
      };
    },
    {
      result: initialResult,
      deduction: initialDeduction,
    }
  );

  return finalResult.result;
};
