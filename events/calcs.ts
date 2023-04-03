import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes, RegularMoneMove, SavedBudgetEntry } from "@/types";
import { createEvent } from "effector";

export const setCalcs = createEvent<ParsedBudgetEntry[]>()

export const setCalcsExternal = createEvent<SavedBudgetEntry[]>()

export const setIncomes = createEvent<ParsedIncomes[]>()

export const setIncomesExternal = createEvent<ParsedIncomes[]>()

export const setExpenses = createEvent<ParsedExpenses[]>()

export const setExpensesExternal = createEvent<ParsedExpenses[]>()

export const setInitialBalance = createEvent<IAccount[]>()

export const setInitialBalanceExternal = createEvent<IAccount[]>()

export const submitRegularMoneyMove = createEvent<RegularMoneMove>()
