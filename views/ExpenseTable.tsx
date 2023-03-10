import Table from '@/components/Table';
import { ParsedConstantMoneyMove } from '@/types';
import { createInputRenderer, createSelectRenderer } from '@/utils/createInputRender';
import React from 'react'

interface Props {
  expenses: ParsedConstantMoneyMove[];
  headers: string[];
  setExpenses: (expenses: ParsedConstantMoneyMove[]) => void;
}
export const ExpenseTable = ({ expenses, headers, setExpenses}: Props) => {
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
                  "number"
                ),
                createInputRenderer(expenses, setExpenses, "income", "number"),
                createInputRenderer(expenses, setExpenses, "expense", "number"),
                createInputRenderer(expenses, setExpenses, "description"),
                createSelectRenderer(expenses, setExpenses, "account"),
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