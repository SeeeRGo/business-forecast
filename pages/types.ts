export type RenderFunc = (value: string) => React.ReactNode;
export type AccountType = "IP" | "OOO";

export interface MoneyMove {
  date: string;
  income: number;
  expense: number;
  comment: string;
  experimentName: string;
  account: AccountType;
  isIncluded: boolen;
}

export type BudgetEntry = [
  isIncluded: boolean,
  date: Date,
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
