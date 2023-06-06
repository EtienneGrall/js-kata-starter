const availableBills = [50, 25, 20, 10, 5, 2, 1] as const;
export type AvailableBills = typeof availableBills[number];

type Withdrawal = Partial<Record<AvailableBills, number>>;

type Configuration = {
  accelerationFunction: (withdrawal: Withdrawal) => boolean;
};

const recursiveAtm =
  ({ accelerationFunction }: Configuration) =>
  (amountToWithdraw: number): Withdrawal => {
    if (amountToWithdraw === 0) {
      return {};
    }

    let currentMinimumNumberOfBills = Infinity;
    let bestWithdrawal = {};
    let hasAccelerated = false;

    const withdrawableBills = availableBills.filter((bill) => bill <= amountToWithdraw);

    for (let index = 0; index < withdrawableBills.length; index++) {
      if (currentMinimumNumberOfBills === 1) {
        continue;
      }

      const billToWithdraw = withdrawableBills[index];
      const remainingAmountToWithdraw = amountToWithdraw - billToWithdraw;
      const remainingWithdrawal = recursiveAtm({ accelerationFunction })(remainingAmountToWithdraw);
      const numberOfBillsInRemainingWithdrwal = countBillsInWithdrwal(remainingWithdrawal);

      if (numberOfBillsInRemainingWithdrwal < currentMinimumNumberOfBills) {
        bestWithdrawal = {
          ...remainingWithdrawal,
          [billToWithdraw]: remainingWithdrawal[billToWithdraw] ? 1 + remainingWithdrawal[billToWithdraw] : 1,
        };
        currentMinimumNumberOfBills = numberOfBillsInRemainingWithdrwal;
        //hasAccelerated = accelerationFunction(bestWithdrawal);
      }
    }

    return bestWithdrawal;
  };

const accelerationFunction = (withdrawal: Withdrawal): boolean => {
  return countBillsInWithdrwal(withdrawal) === 1;
};

export const atm = (amountToWithdraw: number) => {
  const configuration: Configuration = {
    accelerationFunction,
  };
  return recursiveAtm(configuration)(amountToWithdraw);
};

export const countBillsInWithdrwal = (withdrawal: Withdrawal): number => {
  return Object.values(withdrawal).reduce((amountOfBill, currentTotalNumberOfBills) => {
    return currentTotalNumberOfBills + amountOfBill;
  }, 0);
};
