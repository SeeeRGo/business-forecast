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
