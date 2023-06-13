type MappingFunction<U, V> = (u: U, index: number) => V;

type ComparisonFunction<V> = (v1: V, v2: V) => number;

type AccelerationFunction<V> = (v: V) => boolean;

type Input<U, V> = {
  map: MappingFunction<U, V>;
  compare: ComparisonFunction<V>;
  accelerate?: AccelerationFunction<V>;
};

const findBestSolution =
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

export default findBestSolution;
