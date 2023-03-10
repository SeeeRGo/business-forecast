import Table from '@/components/Table';
import { ParsedConstantMoneyMove } from '@/types';
import { createInputRenderer, createSelectRenderer } from '@/utils/createInputRender';
import React from 'react'

interface Props {
  expenses: ParsedConstantMoneyMove[];
  headers: string[];
  setExpenses: (expenses: ParsedConstantMoneyMove[]) => void;
  selectOptions: string[]
}
export const ExpenseTable = ({ expenses, headers, setExpenses, selectOptions}: Props) => {
  return (
    <>
    <span>
      Постоянные расходы
      <button
        onClick={() => {
          const newExpense: ParsedConstantMoneyMove = {
            dayOfMonth: 15,
            income: 0,
            expense: -50000,
            description: 'Новый расход',
            account: 'OOO'
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
                  ({ dayOfMonth, income, expense, description, account }) => [
                    dayOfMonth,
                    income,
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
                createInputRenderer(expenses, setExpenses, "income", {type: "number", min: 0}),
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
                      Del
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