import { Button } from '@mui/material'
import React from 'react'
import Papa from 'papaparse'
import { IAccount, ParsedBudgetEntry } from '@/types'
import { parse } from 'date-fns'
import { v4 as uuidv4 } from "uuid";
import { supabase } from '@/utils/db'


export const UploadRow = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <input
        style={{ display: 'none' }}
        id="calc-file"
        type="file"
        onChange={(e) => {
          const files = e.target.files
          if(files) {
            const reader = new FileReader()
            const file = files[0]
            reader.onload = async function (event) {
              const text = event.target?.result;
              if (typeof text === 'string') {
                const parsed = Papa.parse(text, {
                  header: true
                })
                const accountNames = parsed.meta.fields?.slice(6) ?? ['Основной счёт']
                const initialState = parsed.data[0] as Record<string, string>
                const initialBalances: IAccount[] = accountNames.map(name => {
                  const balance = initialState[name].replace(',', '.')                  
                  return ({ name, balance: parseFloat(balance) ?? 0 })
                })
                const calcs =  parsed.data.slice(1) as Record<string, string>[]
                const parsedCalcs: ParsedBudgetEntry[] = calcs.map((row) => {
                  const income = row['Приход'].replace(',', '.') 
                  const expense = row['Расход'].replace(',', '.') 
                  return ({
                    isIncluded: true,
                    isSelected: false,
                    id: uuidv4(),
                    date: row['Дата'] ? parse(row['Дата'], 'd.M.yyyy', new Date()) : new Date(),
                    income: income ? parseFloat(income) : 0,
                    expense:expense ? parseFloat(expense) : 0,
                    comment: row['Комментарий'] ?? '',
                    account: row['Счёт'] ?? '',
                    moneyMoveCategory: row['Статья бюджета'] ?? '',
                    balances: accountNames.map(name => {

                      return ({ name, balance: 0 })
                    })
                  })
                })
                  const { error } = await supabase.from("data").insert({
                    variant_name: "Базовый",
                    calcs: JSON.stringify(parsedCalcs),
                    initial_balances: JSON.stringify(initialBalances),
                    expenses: JSON.stringify([]),
                    incomes: JSON.stringify([]),
                  });
              }
            };
            reader.readAsText(file)
                    

          }
        }}
      />
      <label htmlFor="calc-file">
        <Button component="span">
          Загрузить таблицу расчетов
        </Button>
      </label>
      <input
        style={{ display: 'none' }}
        id="income-file"
        type="file"
      />
      <label htmlFor="income-file">
        <Button component="span">
          Загрузить таблицу доходов
        </Button>
      </label>
      <input
        style={{ display: 'none' }}
        id="expense-file"
        type="file"
      />
      <label htmlFor="expense-file">
        <Button component="span">
          Загрузить таблицу расходов
        </Button>
      </label>
    </div>
  )
}