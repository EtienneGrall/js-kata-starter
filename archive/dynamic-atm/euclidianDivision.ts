type Input = {
  numerator: number;
  denominator: number;
};

type Output = {
  quotient: number;
  remainder: number;
};

const euclidianDivision = ({ numerator, denominator }: Input): Output => {
  const remainder = numerator % denominator;
  const quotient = (numerator - remainder) / denominator;
  return {
    quotient,
    remainder,
  };
};

export default euclidianDivision;
