import Table from '@/components/Table';
import { ParsedConstantMoneyMove, ParsedExpenses } from '@/types';
import { createInputRenderer, createSelectRenderer } from '@/utils/createInputRender';
import { Delete } from '@mui/icons-material';
import React from 'react'
import { v4 as uuidv4 } from "uuid";

interface Props {
  expenses: ParsedExpenses[];
  headers: string[];
  setExpenses: (expenses: ParsedExpenses[]) => void;
  selectOptions: string[]
}
export const ExpenseTable = ({ expenses, headers, setExpenses, selectOptions}: Props) => {
  return (
    <>
    <span>
      Постоянные расходы
      <button
        onClick={() => {
          const newExpense: ParsedExpenses = {
            dayOfMonth: 15,
            expense: -50000,
            id: uuidv4(),
            description: "Новый расход",
            account: "OOO",
          };
          setExpenses([...expenses, newExpense]);
        }}
      >
        Добавить постоянный расход
      </button>
    </span>
        {expenses.length ? (
          <div style={{ paddingBottom: 16 }}>
            <Table
              data={expenses
                .map(
                  ({ dayOfMonth, expense, description, account }) => [
                    dayOfMonth,
                    expense,
                    description,
                    account,
                    ''
                  ]
                )}
              headers={headers}
              renderFuncs={[
                createInputRenderer(
                  expenses,
                  setExpenses,
                  "dayOfMonth",
                  {type: "number", min: 1, max: 31}
                ),
                createInputRenderer(expenses, setExpenses, "expense", {type: "number", max: 0}),
                createInputRenderer(expenses, setExpenses, "description"),
                createSelectRenderer(expenses, setExpenses, "account", selectOptions),
                (_, rowNumber) => (
                  <>
                    <button
                      onClick={() => {
                        const newExpenses = [...expenses];
                        newExpenses.splice(rowNumber, 1);
                        setExpenses(newExpenses);
                      }}
                    >
                      <Delete fontSize='inherit' />
                    </button>
                  </>
                ),
              ]}
            />
          </div>
        ) : null}
    </>
  )
}