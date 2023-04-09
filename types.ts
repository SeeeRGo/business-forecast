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

export interface BaseBudgetEntry {
  isIncluded: boolean;
  isSelected: boolean;
  id: string;
  income: number;
  expense: number;
  moneyMoveCategory: string;
  comment: string;
  account: string;
  balances: IAccount[];
}
export interface ParsedBudgetEntry extends BaseBudgetEntry {
  date: Date;
}
export interface SavedBudgetEntry extends BaseBudgetEntry {
  date: string;
}

export interface ParsedIncomes {
  dayOfMonth: number;
  id: string;
  income: number;
  moneyMoveCategory: string
  description: string;
  account: string;
}

export interface ParsedExpenses {
  id: string;
  dayOfMonth: number;
  expense: number;
  moneyMoveCategory: string
  description: string;
  account: string;
}

export interface ParsedConstantMoneyMove {
  dayOfMonth: number;
  id: string;
  income: number;
  moneyMoveCategory: string;
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

export interface RegularMoneMove {
  dayOfMonth: number
  amount: number
  moneyMoveCategory: string
  account: string
  comment: string
  regularity: 'monthly'
}

// export interface Save