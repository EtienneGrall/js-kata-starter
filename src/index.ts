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
  nextStrong: StrongDigit;
  direction: "weakToStrong";
};
type StrongToWeakTransition = {
  strong: StrongDigit;
  nextWeak: WeakDigit;
  direction: "strongToWeak";
};

type Transition = WeakToStrongTransition | StrongToWeakTransition;

const transitions: Array<Transition> = [
  {
    weak: "I",
    nextStrong: "V",
    direction: "weakToStrong",
  },
  {
    nextWeak: "X",
    strong: "V",
    direction: "strongToWeak",
  },
  {
    weak: "X",
    nextStrong: "L",
    direction: "weakToStrong",
  },
  {
    nextWeak: "C",
    strong: "L",
    direction: "strongToWeak",
  },
  {
    weak: "C",
    nextStrong: "D",
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

const addStrongs = (transition: StrongToWeakTransition) => (a: StructuredRomanNumber, b: StructuredRomanNumber) => {
  const nextWeak = transition.nextWeak;
  const strong = transition.strong;

  const strongTable = strongAdditionTable(strong, nextWeak);

  // Both are defined
  if (a[strong] && b[strong]) {
    const additionResult = strongTable[a[strong]][b[strong]];

    return {
      [nextWeak]: `${additionResult.weaks}`,
      [strong]: undefined,
    };
  }

  // Only one is defined
  if ((a[strong] && !b[strong]) || (b[strong] && !a[strong])) {
    return { [strong]: a[strong] ?? b[strong] };
  }

  return {};
};

const addWeaks = (transition: WeakToStrongTransition) => (a: StructuredRomanNumber, b: StructuredRomanNumber) => {
  const weak = transition.weak;
  const nextStrong = transition.nextStrong;

  // Both are defined
  if (a[weak] && b[weak]) {
    const weakTable = weakAdditionTable(weak, nextStrong);

    const additionResult = weakTable[a[weak]][b[weak]];

    if (!("strong" in additionResult)) {
      return { result: { [weak]: additionResult.weaks }, deduction: {} };
    }

    if (!("weaks" in additionResult)) {
      return { deduction: { [nextStrong]: additionResult.strong }, result: {} };
    }

    if ("weaks" in additionResult && "strong" in additionResult) {
      return { result: { [weak]: additionResult.weaks }, deduction: { [nextStrong]: additionResult.strong } };
    }
  }

  // Only one is defined
  if ((a[weak] && !b[weak]) || (b[weak] && !a[weak])) {
    return { result: { [weak]: a[weak] ?? b[weak] }, deduction: {} };
  }

  return { result: {}, deduction: {} };
};

export const add = (a: StructuredRomanNumber, b: StructuredRomanNumber): StructuredRomanNumber => {
  let initialResult: StructuredRomanNumber = {};
  let initialDeduction: StructuredRomanNumber = {};

  const finalResult = transitions.reduce(
    (accumulator, transition) => {
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
        const strong = transition.strong;
        const resultForThisIterrationWithoutDeduction = {
          ...accumulator.result,
          ...addStrongs(transition)(a, b),
        };

        resultForThisIterration = {
          ...resultForThisIterrationWithoutDeduction,
          ...addStrongs(transition)(
            { [strong]: resultForThisIterrationWithoutDeduction[strong] },
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
