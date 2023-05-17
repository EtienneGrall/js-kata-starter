const availableBills = [50, 25, 20, 10, 5, 2, 1] as const;
export type AvailableBills = typeof availableBills[number];

type Withdrawal = Partial<Record<AvailableBills, number>>;

const recursiveAtm = (amountToWithdraw: number, numberOfAlreadWithdrawnBills: number): Withdrawal => {
  if (amountToWithdraw === 0) {
    return {};
  }

  const withdrawableBills = availableBills.filter((bill) => bill <= amountToWithdraw);
  const possibleWithdrawals = withdrawableBills
    .map((billToWithdraw) => {
      const remainingAmountToWithdraw = amountToWithdraw - billToWithdraw;
      const remainingWithdrawal = recursiveAtm(remainingAmountToWithdraw, numberOfAlreadWithdrawnBills + 1);

      return {
        ...remainingWithdrawal,
        [billToWithdraw]: remainingWithdrawal[billToWithdraw] ? 1 + remainingWithdrawal[billToWithdraw] : 1,
      };
    })
    .sort((withdrawalA, withdrawalB) => countBillsInWithdrwal(withdrawalA) - countBillsInWithdrwal(withdrawalB));

  return possibleWithdrawals.at(0);
};

export const atm = (amountToWithdraw: number) => recursiveAtm(amountToWithdraw, 0);

export const countBillsInWithdrwal = (withdrawal: Withdrawal): number => {
  return Object.values(withdrawal).reduce((amountOfBill, currentTotalNumberOfBills) => {
    return currentTotalNumberOfBills + amountOfBill;
  }, 0);
};
