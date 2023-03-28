import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes, RegularMoneMove } from "@/types";
import { createEvent } from "effector";

export const setCalcs = createEvent<ParsedBudgetEntry[]>()

export const setIncomes = createEvent<ParsedIncomes[]>()

export const setExpenses = createEvent<ParsedExpenses[]>()

export const setInitialBalance = createEvent<IAccount[]>()

export const submitRegularMoneyMove = createEvent<RegularMoneMove>()
