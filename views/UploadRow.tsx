import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import Papa from 'papaparse'
import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes } from '@/types'
import { parse } from 'date-fns'
import { v4 as uuidv4 } from "uuid";
import { supabase } from '@/utils/db'


export const UploadRow = () => {
  const [calcs, setCalcs] = useState<ParsedBudgetEntry[]>([])
  const [calcHeaders, setCalcHeaders] = useState<string[]>([])
  const [calcFilename, setCalcFilename] = useState('')

  const [incomes, setIncomes] = useState<ParsedIncomes[]>([])
  const [incomeHeaders, setIncomeHeaders] = useState<string[]>([])
  const [incomeFilename, setIncomeFilename] = useState("");

  const [expenses, setExpenses] = useState<ParsedExpenses[]>([])
  const [expensesHeaders, setExpensesHeaders] = useState<string[]>([])
  const [expenseFilename, setExpenseFilename] = useState("");

  const [initial, setInitial] = useState<IAccount[]>([])
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <input
        style={{ display: "none" }}
        id="calc-file"
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            const reader = new FileReader();
            const file = files[0];
            setCalcFilename(file.name ?? "");
            reader.onload = async function (event) {
              const text = event.target?.result;
              if (typeof text === "string") {
                const parsed = Papa.parse(text, {
                  header: true,
                });
                const accountNames = parsed.meta.fields?.slice(6) ?? [
                  "Основной счёт",
                ];
                const initialState = parsed.data[0] as Record<string, string>;
                const initialBalances: IAccount[] = accountNames.map((name) => {
                  const balance = initialState[name].replace(",", ".");
                  return { name, balance: parseFloat(balance) ?? 0 };
                });
                const calcs = parsed.data.slice(1) as Record<string, string>[];
                const parsedCalcs: ParsedBudgetEntry[] = calcs.map((row) => {
                  const income = row["Приход"].replace(",", ".");
                  const expense = row["Расход"].replace(",", ".");
                  return {
                    isIncluded: true,
                    isSelected: false,
                    id: uuidv4(),
                    date: row["Дата"]
                      ? parse(row["Дата"], "d.M.yyyy", new Date())
                      : new Date(),
                    income: income ? parseFloat(income) : 0,
                    expense: expense ? parseFloat(expense) : 0,
                    comment: row["Комментарий"] ?? "",
                    account: row["Счёт"] ?? "",
                    moneyMoveCategory: row["Статья бюджета"] ?? "",
                    balances: accountNames.map((name) => {
                      return { name, balance: 0 };
                    }),
                  };
                });
                setInitial(initialBalances);
                setCalcHeaders(parsed.meta.fields ?? []);
                setCalcs(parsedCalcs);
              }
            };
            reader.readAsText(file);
          }
        }}
      />
      <label htmlFor="calc-file">
        <Button component="span">Загрузить таблицу расчетов</Button>
      </label>
      {calcFilename ? <Typography>{calcFilename}</Typography> : null}
      <input
        style={{ display: "none" }}
        id="income-file"
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            const reader = new FileReader();
            const file = files[0];
            setIncomeFilename(file.name ?? "");
            reader.onload = async function (event) {
              const text = event.target?.result;
              if (typeof text === "string") {
                const parsed = Papa.parse(text, {
                  header: true,
                });
                const headers = parsed.meta.fields ?? [];
                const incomes = parsed.data as Record<string, string>[];
                const parsedIncomes: ParsedIncomes[] = incomes.map((row) => {
                  return {
                    dayOfMonth: row["Число месяца"]
                      ? parseInt(row["Число месяца"])
                      : 1,
                    id: uuidv4(),
                    income: row["Доход"] ? parseFloat(row["Доход"]) : 0,
                    description: row["Описание"] ?? "",
                    account: row["Счет"] ?? "",
                    moneyMoveCategory: row["Статья бюджета"] ?? "",
                  };
                });
                setIncomeHeaders(headers);
                setIncomes(parsedIncomes);
              }
            };
            reader.readAsText(file);
          }
        }}
      />
      <label htmlFor="income-file">
        <Button component="span">Загрузить таблицу доходов</Button>
      </label>
      {incomeFilename ? <Typography>{incomeFilename}</Typography> : null}
      <input
        style={{ display: "none" }}
        id="expense-file"
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            const reader = new FileReader();
            const file = files[0];
            setExpenseFilename(file.name ?? "");
            reader.onload = async function (event) {
              const text = event.target?.result;
              if (typeof text === "string") {
                const parsed = Papa.parse(text, {
                  header: true,
                });
                const headers = parsed.meta.fields ?? [];
                const expenses = parsed.data as Record<string, string>[];
                const parsedExpenses: ParsedExpenses[] = expenses.map((row) => {
                  return {
                    dayOfMonth: row["Число месяца"]
                      ? parseInt(row["Число месяца"])
                      : 1,
                    id: uuidv4(),
                    expense: row["Расход"] ? parseFloat(row["Расход"]) : 0,
                    description: row["Описание"] ?? "",
                    account: row["Счет"] ?? "",
                    moneyMoveCategory: row["Статья бюджета"] ?? "",
                  };
                });
                setExpensesHeaders(headers);
                setExpenses(parsedExpenses);
              }
            };
            reader.readAsText(file);
          }
        }}
      />
      <label htmlFor="expense-file">
        <Button component="span">Загрузить таблицу расходов</Button>
      </label>
      {expenseFilename ? <Typography>{expenseFilename}</Typography> : null}
      <Button
        onClick={async () => {
          const { error, data } = await supabase
            .from("data")
            .insert({
              variant_name: "Базовый",
              calcs: JSON.stringify(calcs),
              initial_balances: JSON.stringify(initial),
              expenses: JSON.stringify(expenses),
              incomes: JSON.stringify(incomes),
            })
            .select();
          if (data?.at(0)?.id) {
            const { error } = await supabase.from("headers").insert({
              variant_id: data?.at(0)?.id,
              calcHeaders: JSON.stringify(calcHeaders),
              incomeHeaders: JSON.stringify(incomeHeaders),
              expenseHeaders: JSON.stringify(expensesHeaders),
            });
          }
        }}
      >
        Сохранить базовый вариант
      </Button>
    </div>
  );
}