import { IAccount } from "@/types";

export const parseAccounts = (headers: string[], accounts: string[]): IAccount[] => {
  return headers.map((header, i) => ({
    name: header,
    balance: accounts[i] ? parseFloat(accounts[i]) : 0
  }))
}