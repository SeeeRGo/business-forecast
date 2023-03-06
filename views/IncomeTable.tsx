import Table from '@/components/Table';
import { ParsedConstantMoneyMove } from '@/types';
import { createInputRenderer, createSelectRenderer } from '@/utils/createInputRender';
import React from 'react'

interface Props {
  incomes: ParsedConstantMoneyMove[]
  setIncomes: (incomes: ParsedConstantMoneyMove[]) => void
}
export const IncomeTable = ({ incomes, setIncomes }: Props) => {
  return (
    <>
      <span>
        Постоянные доходы
        <button
          onClick={() => {
            const newIncome: ParsedConstantMoneyMove = {
              dayOfMonth: 15,
              income: 150000,
              expense: 0,
              description: 'New Income',
              account: 'OOO'
            };
            setIncomes([...incomes, newIncome]);
          }}
        >
          Добавить постоянный доход
        </button>
      </span>
        {incomes.length ? (
          <div style={{ paddingBottom: 16 }}>
            <Table
              data={incomes
                .slice(1)
                .map(
                  ({ dayOfMonth, income, expense, description, account }) => [
                    dayOfMonth,
                    income,
                    expense,
                    description,
                    account,
                  ]
                )}
              headers={Object.values(incomes[0])}
              renderFuncs={[
                createInputRenderer(
                  incomes,
                  setIncomes,
                  "dayOfMonth",
                  "number"
                ),
                createInputRenderer(incomes, setIncomes, "income", "number"),
                createInputRenderer(incomes, setIncomes, "expense", "number"),
                createInputRenderer(incomes, setIncomes, "description"),
                createSelectRenderer(incomes, setIncomes, "account"),
              ]}
            />
          </div>
        ) : null}
    </>
  )
}