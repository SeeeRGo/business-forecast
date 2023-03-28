import Table from '@/components/Table';
import { setExpenses } from '@/events/calcs';
import { $expenses, $expensesHeaders, $moneyMoveCategories, $selectOptions } from '@/stores/calcs';
import { ParsedExpenses } from '@/types';
import { createInputRenderer, createSelectRenderer, createTextAreaRenderer } from '@/utils/createInputRender';
import { Delete } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useStore } from 'effector-react';
import React from 'react'
import { v4 as uuidv4 } from "uuid";

export const ExpenseTable = () => {
  const selectOptions = useStore($selectOptions)

  const expenses = useStore($expenses)
  const expenseHeaders = useStore($expensesHeaders)
  const categories = useStore($moneyMoveCategories)

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">
          Постоянные расходы
        </Typography>
        <Button
          sx={{ padding: 0 }}
          onClick={() => {
            const newExpense: ParsedExpenses = {
              dayOfMonth: 15,
              expense: -50000,
              id: uuidv4(),
              moneyMoveCategory: categories.at(0) ?? '',
              description: "Новый расход",
              account: selectOptions.at(0) ?? '',
            };
            setExpenses([...expenses, newExpense]);
          }}
        >
          + Расход
        </Button>
      </div>
      {expenses.length ? (
        <div style={{ paddingBottom: 16 }}>
          <Table
            data={expenses.map(
              ({ dayOfMonth, expense, description, account, moneyMoveCategory }) => [
                dayOfMonth,
                expense,
                description,
                account,
                moneyMoveCategory,
                "",
              ]
            )}
            headers={expenseHeaders}
            renderFuncs={[
              createInputRenderer(expenses, setExpenses, "dayOfMonth", {
                type: "number",
                min: 1,
                max: 31,
              }),
              createInputRenderer(expenses, setExpenses, "expense", {
                type: "number",
                max: 0,
              }),
              createTextAreaRenderer(expenses, setExpenses, "description"),
              createSelectRenderer(
                expenses,
                setExpenses,
                "account",
                selectOptions
              ),
              createSelectRenderer(
                expenses,
                setExpenses,
                'moneyMoveCategory',
                categories
              ),
              (_, rowNumber) => (
                <>
                  <button
                    onClick={() => {
                      const newExpenses = [...expenses];
                      newExpenses.splice(rowNumber, 1);
                      setExpenses(newExpenses);
                    }}
                  >
                    <Delete fontSize="inherit" />
                  </button>
                </>
              ),
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}