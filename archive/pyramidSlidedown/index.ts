// Utils

const sum = (accumulator: number, current: number) => accumulator + current;

type MappingFunction<U, V> = (u: U, index: number) => V;

type ComparisonFunction<V> = (v1: V, v2: V) => number;

type AccelerationFunction<V> = (v: V) => boolean;

type Input<U, V> = {
  map: MappingFunction<U, V>;
  compare: ComparisonFunction<V>;
  accelerate?: AccelerationFunction<V>;
};

export const findBestSolution =
  <U, V>({ map, compare, accelerate }: Input<U, V>) =>
  (values: U[]): V => {
    let solutions: V[] = [];

    let hasAccelerated = false;

    for (let index = 0; index < values.length; index++) {
      if (hasAccelerated) {
        continue;
      }

      const result = map(values[index], index);
      solutions.push(result);

      if (!!accelerate && accelerate(result)) {
        hasAccelerated = true;
      }
    }

    return solutions.sort(compare)[0];
  };

export type Pyramid = number[][];

const example: Pyramid = [[3], [7, 4], [4, 2, 3], [6, 5, 9, 3]];

type Position = {
  line: number;
  column: number;
};

type Path = Position[];

export type EvaluatedPath = number[];

const left = ({ line, column }: Position): Position => ({
  line: line + 1,
  column,
});

const right = ({ line, column }: Position): Position => ({
  line: line + 1,
  column: column + 1,
});

const value =
  (pyramid: Pyramid) =>
  ({ line, column }: Position): number =>
    pyramid[line][column];

const evaluate =
  (pyramid: Pyramid) =>
  (path: Path): number =>
    path.map(value(pyramid)).reduce(sum, 0);

const recursivePyramidSlideDown =
  (pyramid: Pyramid) =>
  (origin: Position): Path => {
    if (origin.line === pyramid.length - 1) {
      return [origin];
    }

    const computePath = (nextPosition: Position): Path => {
      return [origin, ...recursivePyramidSlideDown(pyramid)(nextPosition)];
    };

    const comparisionFunction = (pathA: Path, pathB: Path) => {
      return evaluate(pyramid)(pathB) - evaluate(pyramid)(pathA);
    };

    return findBestSolution<Position, Path>({
      map: computePath,
      compare: comparisionFunction,
    })([left(origin), right(origin)]);
  };

export const pyramidSlideDown = (pyramid: Pyramid): EvaluatedPath =>
  recursivePyramidSlideDown(pyramid)({ line: 0, column: 0 }).map(value(pyramid));
