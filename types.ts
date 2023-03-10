export type RenderFunc = <T extends string | number | boolean | Date>(value: T, rowNumber: number) => React.ReactNode;

export type BudgetEntry = [
  date: string,
  income: string,
  expense: string,
  comment: string,
  variantName: string,
  account: string,
  entry: string,
  ...rest: string[]
];

export type ConstantMoneyMove = [
  dayOfTheMonth: number,
  income: number,
  expense: number,
  description: string,
  account: string
];

export interface ParsedBudgetEntry {
  isIncluded: boolean;
  date: Date;
  income: number;
  expense: number;
  comment: string;
  account: string;
  balances: IAccount[];
}

export interface ParsedConstantMoneyMove {
  dayOfMonth: number;
  income: number;
  expense: number;
  description: string;
  account: string;
}

export interface IAccount {
  name: string
  balance: number
}
export interface IVariant {
  name: string;
  entries: ParsedBudgetEntry[];
}
