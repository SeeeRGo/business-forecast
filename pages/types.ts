export type RenderFunc = <T>(value: T, rowNumber: number) => React.ReactNode;
export type AccountType = "IP" | "OOO" | "Third" | "Fourth" | '';

export type BudgetEntry = [
  date: string,
  income: string,
  expense: string,
  comment: string,
  variantName: string,
  account: string,
  entry: string,
  balanceIP: string,
  balanceOOO: string,
  balanceThird: string,
  balanceFourth: string
];

export type ConstantMoneyMove = [
  dayOfTheMonth: number,
  income: number,
  expense: number,
  description: string,
  account: AccountType
];

export interface ParsedBudgetEntry {
  isIncluded: boolean;
  date: Date;
  income: number;
  expense: number;
  comment: string;
  account: AccountType;
  balanceIP: number;
  balanceOOO: number;
  balanceThird: number;
  balanceFourth: number;
}
