import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { IAccount, ParsedBudgetEntry, ParsedConstantMoneyMove } from "../types";
import { parseCalcs } from "../utils/parseCalcs";
import { parseIncomes } from "../utils/parseIncomes";
import { parseExpenses } from "../utils/parseExpenses";
import { calculateBudget } from "../utils/utils";
import { baseUrl } from "../constants";
import { IncomeTable } from "@/views/IncomeTable";
import { ExpenseTable } from "@/views/ExpenseTable";
import { Settings } from "@/views/Settings";
import { CalcsTable } from "@/views/CalcsTable";
import { parseAccounts } from "@/utils/parseAccounts";

export default function Home() {
  const [calcs, setCalcs] = useState<ParsedBudgetEntry[]>([]);
  const [calcHeaders, setCalcHeaders] = useState<string[]>([]);
  const [initialBalance, setInitialBalance] = useState<IAccount[]>([]);

  const [incomes, setIncomes] = useState<ParsedConstantMoneyMove[]>([]);
  const [incomeHeaders, setIncomeHeaders] = useState<string[]>([])

  const [expenses, setExpenses] = useState<ParsedConstantMoneyMove[]>([]);
  const [expenseHeaders, setExpenseHeaders] = useState<string[]>([]);

  useEffect(() => {
    async function get() {
      const res = await axios.get(baseUrl);
      const parsedCalcs = parseCalcs(res.data.calcs, res.data.calcHeaders.slice(5));
      const parsedIncomes = parseIncomes(res.data.income);
      const parsedExpenses = parseExpenses(res.data.expense);
      const { calcInitial, calcHeaders, incomeHeaders, expenceHeaders } =
        res.data;
      const parsedInitial = parseAccounts(calcHeaders.slice(5), calcInitial.slice(5));

      setInitialBalance(parsedInitial)
      setCalcHeaders(calcHeaders);
      setIncomeHeaders([...incomeHeaders, 'actions'])
      setIncomes(parsedIncomes);
      setExpenseHeaders([...expenceHeaders, 'actions'])
      setExpenses(parsedExpenses);
      const calculatedCalcs = calculateBudget(
        parsedCalcs,
        parsedIncomes,
        parsedExpenses,
        0
      );
      setCalcs(calculatedCalcs);
    }
    get();
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <IncomeTable incomes={incomes} headers={incomeHeaders} setIncomes={setIncomes} selectOptions={calcHeaders.slice(5)} /> 
        <ExpenseTable expenses={expenses} headers={expenseHeaders} setExpenses={setExpenses} selectOptions={calcHeaders.slice(5)} />
        <Settings incomes={incomes} expenses={expenses} calcInitial={initialBalance} calcs={calcs} setCalcInitial={setInitialBalance} setCalcs={setCalcs} />
        <CalcsTable calcs={calcs} headers={["included", ...calcHeaders, "actions"]} initialState={initialBalance} setCalcs={setCalcs} selectOptions={calcHeaders.slice(5)} /> 
      </main>
    </>
  );
}
