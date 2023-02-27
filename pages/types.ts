export type RenderFunc = <T>(value: T, rowNumber: number) => React.ReactNode;
export type AccountType = "IP" | "OOO";

export type BudgetEntry = [
  isIncluded: boolean,
  date: string,
  income: number,
  expense: number,
  comment: string,
  variantName: string,
  account: AccountType,
  entry: string,
  balanceIP: number,
  balanceOOO: number
];

export type ConstantMoneyMove = [
  dayOfTheMonth: number,
  income: number,
  expense: number,
  description: string,
  account: AccountType
];
